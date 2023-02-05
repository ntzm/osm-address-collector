import {saveAs} from 'file-saver-es'
import Feature from 'ol/Feature'
import Map from 'ol/Map.js'
import Point from 'ol/geom/Point.js'
import View from 'ol/View.js'
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js'
import {OSM, Vector as VectorSource} from 'ol/source.js'
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import {fromLonLat} from 'ol/proj'
import Storage from './storage.mjs'
import {State, SurveyStatus} from './state.mjs'
import {getOsmFile} from './osm-xml'
import Logger from './logger.mjs'
import guessNextNumber from './guess-next-number'
import {move} from './geo.mjs'
import findNearestStreets from './find-nearest-streets.mjs'
import 'ol/ol.css'

const storage = new Storage(localStorage)
const state = new State(storage)
const surveyStatus = state.surveyStatus
surveyStatus.value = SurveyStatus.UNSTARTED

const logger = new Logger(state.logs)
logger.log('Initialised')
logger.log(`User agent: ${navigator.userAgent}`)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
}

const onClick = ($element, callback) => {
  $element.addEventListener('click', callback)
}

const onTouch = ($element, callback) => {
  $element.addEventListener('touchstart', event => {
    event.preventDefault()
    callback(event)
  })

  $element.addEventListener('click', callback)
}

/*
HISTORY
*/

const $history = document.querySelector('#history')

const addAction = action => {
  const item = document.createElement('li')
  item.textContent = action
  $history.prepend(item)

  if ($history.children.length > 2) {
    $history.lastChild.remove()
  }
}

surveyStatus.subscribe(() => {
  const map = {
    [surveyStatus.isPaused]: 'Paused',
    [surveyStatus.isStarting]: 'Starting',
    [surveyStatus.isStarted]: 'Started',
    [surveyStatus.isError]: 'Error',
    [surveyStatus.isFinishing]: 'Finishing',
    [surveyStatus.isFinished]: 'Finished',
  }

  addAction(map.true)
})

/*
SETTINGS
*/

const $settings = document.querySelector('#settings')

onClick(document.querySelector('#info-row'), () => {
  $settings.style.display = 'block'
})

onClick(document.querySelector('#close-settings'), () => {
  $settings.style.display = 'none'
})

/*
SETTINGS - Advanced
*/

document.querySelector('#setting-advanced').addEventListener('click', () => {
  alert(
    `Orientation is used to throw address nodes in the correct direction.
Orientation provider shows the method to get your device's orientation.
Orientation shows your device's current orientation.

We use Overpass API to find streets nearby to you.
You can customise the timeout and the endpoint here.
Do not change the endpoint unless you know what you are doing!`,
  )
})

const overpassTimeout = state.overpassTimeout
const $overpassTimeout = document.querySelector('#overpass-timeout')
$overpassTimeout.value = overpassTimeout.value

overpassTimeout.subscribe(({value}) => {
  $overpassTimeout.value = value
})

$overpassTimeout.addEventListener('input', () => {
  overpassTimeout.value = $overpassTimeout.value
})

const overpassEndpoint = state.overpassEndpoint
const $overpassEndpoint = document.querySelector('#overpass-endpoint')
$overpassEndpoint.value = overpassEndpoint.value

overpassEndpoint.subscribe(({value}) => {
  $overpassEndpoint.value = value
})

$overpassEndpoint.addEventListener('input', () => {
  overpassEndpoint.value = $overpassEndpoint.value
})

/*
SETTINGS - Info
*/

const $orientationProvider = document.querySelector('#orientation-provider')

/*
SETTINGS - General
*/

document.querySelector('#setting-general').addEventListener('click', () => {
  alert(
    `Choose a distance to throw address nodes from your current position.
If you add an address node by pressing the left arrow key, it will throw the node to your left by this amount.`,
  )
})

const distance = state.distance
const $distance = document.querySelector('#distance')
const $distanceDisplay = document.querySelector('#distance-display')
$distance.value = distance.value
$distanceDisplay.textContent = distance.value

distance.subscribe(({value}) => {
  $distance.value = value
  $distanceDisplay.textContent = value
})

$distance.addEventListener('input', () => {
  distance.value = $distance.value
})

/*
SETTINGS - Street
*/

document.querySelector('#setting-street').addEventListener('click', () => {
  alert(
    `Add a street to address nodes.
The street you choose will only be applied to addresses going forward.
You can type in the street name manually, or click "Get streets" to retrieve a list of streets near to you.
You can change the distance it will look for nearby streets with the "Street search distance" slider.`,
  )
})

const streets = state.streets

const $streets = document.querySelector('#streets')
const $street = document.querySelector('#street')
const $updateStreets = document.querySelector('#update-streets')
const $updateStreetsStatus = document.querySelector('#update-streets-status')

const streetSearchDistance = state.streetSearchDistance
const $streetSearchDistance = document.querySelector('#street-search-distance')
const $streetSearchDistanceDisplay = document.querySelector('#street-search-distance-display')
$streetSearchDistance.value = streetSearchDistance.value
$streetSearchDistanceDisplay.textContent = streetSearchDistance.value

streetSearchDistance.subscribe(({value}) => {
  $streetSearchDistance.value = value
  $streetSearchDistanceDisplay.textContent = value
})

$streetSearchDistance.addEventListener('input', () => {
  streetSearchDistance.value = $streetSearchDistance.value
})

$street.addEventListener('focus', () => {
  $street.value = ''
})

streets.subscribe(({value}) => {
  $streets.replaceChildren(
    ...value.map(street => {
      const $option = document.createElement('option')
      $option.value = street
      return $option
    }),
  )

  $updateStreetsStatus.textContent = `Found ${value.length} street${value.length === 1 ? '' : 's'}`
  $updateStreetsStatus.classList.add('status--good')
})

onClick($updateStreets, async () => {
  if (currentPosition.value === undefined) {
    $updateStreetsStatus.textContent = 'GPS required'
    $updateStreetsStatus.classList.add('status--bad')
    return
  }

  $updateStreets.disabled = true
  $updateStreetsStatus.textContent = 'Updating streets...'
  $updateStreetsStatus.classList.remove('status--good', 'status--bad')

  try {
    streets.value = await findNearestStreets(
      currentPosition.value,
      streetSearchDistance.value,
      overpassEndpoint.value,
      overpassTimeout.value,
    )
  } catch (error) {
    let message = error.message

    if (error.name === 'AbortError') {
      message = 'Timed out'
    }

    $updateStreetsStatus.textContent = `Overpass error: ${message}`
    $updateStreetsStatus.classList.add('status--bad')
    return
  } finally {
    $updateStreets.disabled = false
  }
})

/*
SETTINGS - Custom tags
*/

document.querySelector('#setting-custom-tags').addEventListener('click', () => {
  alert(
    `Add custom OSM tags to each address node.
The tags you add will only be applied to addresses going forward.`,
  )
})

const customTagsKey = 'customTags'
const defaultCustomTags = {}
let customTags = storage.getJson(customTagsKey, defaultCustomTags)
const $customTagContainer = document.querySelector('#custom-tags')

const $addCustomTag = document.querySelector('#add-custom-tag')

const updateCustomTags = event => {
  if (event && event.target.classList.contains('key-input') && event.target.value === 'addr:street') {
    alert('Please use the street setting above to set the street instead of the custom tags')
  }

  customTags = Object.fromEntries(
    [...document.querySelectorAll('.custom-tag')].map($tag => [
      $tag.querySelector('.key-input').value,
      $tag.querySelector('.value-input').value,
    ]),
  )

  storage.setJson(customTagsKey, customTags)
}

const addCustomTag = (key, value) => {
  const container = document.createElement('div')
  container.classList.add('custom-tag', 'setting-list__row')

  const removeButton = document.createElement('button')
  removeButton.textContent = 'x'

  onClick(removeButton, () => {
    container.remove()
    updateCustomTags()
  })

  const keyInput = document.createElement('input')
  keyInput.type = 'text'
  keyInput.value = key
  keyInput.placeholder = 'Key'
  keyInput.autocapitalize = 'none'
  keyInput.setAttribute('list', 'tag-keys')
  keyInput.classList.add('key-input', 'setting-input', 'setting-list__input')

  const valueInput = document.createElement('input')
  valueInput.type = 'text'
  valueInput.value = value
  valueInput.placeholder = 'Value'
  valueInput.classList.add('value-input', 'setting-input', 'setting-list__input')

  keyInput.addEventListener('blur', updateCustomTags)
  valueInput.addEventListener('blur', updateCustomTags)

  container.append(removeButton)
  container.append(keyInput)
  container.append(valueInput)

  $customTagContainer.append(container)
}

for (const [key, value] of Object.entries(customTags)) {
  addCustomTag(key, value)
}

onClick($addCustomTag, () => addCustomTag('', ''))

/*
SETTINGS - SKIP NUMBERS
*/

document.querySelector('#setting-skip-numbers').addEventListener('click', () => {
  alert(
    `Choose some numbers to skip when the app tries to guess the next number in the sequence.
For example, in the UK the number 13 is often skipped.`,
  )
})

const skipNumbersKey = 'skipNumbers'
const defaultSkipNumbers = []
let skipNumbers = storage.getJson(skipNumbersKey, [])
const $skipNumbersContainer = document.querySelector('#skip-numbers')

const $addSkipNumber = document.querySelector('#add-skip-number')

const updateSkipNumbers = () => {
  skipNumbers = [...document.querySelectorAll('.skip-number')]
    .map($tag => $tag.querySelector('.number-input').value)
    .filter(value => value !== '')
    .map(Number)

  storage.setJson(skipNumbersKey, skipNumbers)
}

const addSkipNumber = number => {
  const container = document.createElement('div')
  container.classList.add('skip-number', 'setting-list__row')

  const removeButton = document.createElement('button')
  removeButton.textContent = 'x'

  onClick(removeButton, () => {
    container.remove()
    updateSkipNumbers()
  })

  const input = document.createElement('input')
  input.type = 'number'
  input.value = number
  input.placeholder = 'Number'
  input.classList.add('number-input', 'setting-input', 'setting-list__input')

  input.addEventListener('blur', updateSkipNumbers)

  container.append(removeButton)
  container.append(input)

  $skipNumbersContainer.append(container)
}

for (const skipNumber of skipNumbers) {
  addSkipNumber(skipNumber)
}

onClick($addSkipNumber, () => addSkipNumber(''))

/*
SETTINGS - Reset
*/

const $resetSettings = document.querySelector('#reset-settings')
onClick($resetSettings, () => {
  if (!confirm('Are you sure you want to reset the settings to the default values?')) {
    return
  }

  overpassTimeout.reset()
  overpassEndpoint.reset()
  distance.reset()
  streetSearchDistance.reset()

  customTags = defaultCustomTags
  $customTagContainer.replaceChildren()
  storage.setJson(customTagsKey, defaultCustomTags)

  skipNumbers = defaultSkipNumbers
  $skipNumbersContainer.replaceChildren()
  storage.setJson(skipNumbersKey, defaultSkipNumbers)
})

/*
RECORDING
*/

const notes = state.notes
const addresses = state.addresses

const $currentNumberOrName = document.querySelector('#current-number-or-name')
let lastSkippedNumbers = []
let numberIsGuessed = false

const currentPosition = state.position
const orientation = state.orientation

{
  const addressCount = addresses.value.length
  const noteCount = notes.value.length

  if (
    addressCount + noteCount > 0
    && !confirm(`You have ${addressCount} unsaved address${addressCount === 1 ? '' : 'es'} and ${noteCount} unsaved note${noteCount === 1 ? '' : 's'} from the previous session, do you want to load them?`)
  ) {
    addresses.reset()
    notes.reset()
  }
}

$currentNumberOrName.addEventListener('focus', () => {
  if (numberIsGuessed) {
    $currentNumberOrName.classList.remove('guessed')
    $currentNumberOrName.value = ''
  }
})

const elementsToDisable = document.querySelectorAll('.disabled')

surveyStatus.subscribe(({previous}) => {
  if (surveyStatus.isStarted) {
    for (const element of elementsToDisable) {
      element.classList.remove('disabled')
    }

    return
  }

  if (previous === SurveyStatus.STARTED) {
    for (const element of elementsToDisable) {
      element.classList.add('disabled')
    }
  }
})

for (const append of document.querySelectorAll('.append')) {
  onTouch(append, () => {
    if (numberIsGuessed) {
      numberIsGuessed = false
      lastSkippedNumbers = []
      $currentNumberOrName.classList.remove('guessed')
      $currentNumberOrName.value = ''
    }

    $currentNumberOrName.value = $currentNumberOrName.value.concat(
      append.dataset.number,
    )
  })
}

for (const submit of document.querySelectorAll('.submit')) {
  onTouch(submit, () => {
    if (currentPosition.value === undefined) {
      alert('No GPS')
      return
    }

    const numberOrName = $currentNumberOrName.value

    if (numberOrName === '') {
      alert('No number or name')
      return
    }

    let bearing = orientation.value.degrees

    if (bearing === null) {
      alert('No orientation available')
      return
    }

    const direction = submit.dataset.direction

    if (direction === 'L') {
      bearing -= 90
    }

    if (direction === 'R') {
      bearing += 90
    }

    bearing %= 360

    if (bearing < 0) {
      bearing += 360
    }

    const newPosition = move(currentPosition.value, bearing, distance.value)

    addresses.add({
      latitude: newPosition.latitude,
      longitude: newPosition.longitude,
      numberOrName,
      customTags,
      direction,
      skippedNumbers: lastSkippedNumbers,
      street: $street.value,
    })

    addAction(`+ ${direction} ${numberOrName}`)

    let guessedNextNumber;
    [guessedNextNumber, lastSkippedNumbers] = guessNextNumber(addresses.value, skipNumbers)

    if (!guessedNextNumber) {
      $currentNumberOrName.value = ''
      return
    }

    $currentNumberOrName.value = guessedNextNumber
    $currentNumberOrName.classList.add('guessed')
    numberIsGuessed = true
  })
}

/*
GPS
*/

const $startOrPause = document.querySelector('#start-or-pause')
let watchId
const $accuracy = document.querySelector('#accuracy')
const positions = []

surveyStatus.subscribe(() => {
  $startOrPause.textContent = {
    [surveyStatus.isPaused]: 'Start',
    [surveyStatus.isStarting]: 'Starting',
    [surveyStatus.isStarted]: 'Pause',
    [surveyStatus.isError]: 'Start',
    [surveyStatus.isFinished]: 'Start',
  }.true
})

surveyStatus.subscribe(() => {
  if (!surveyStatus.isStarted) {
    $accuracy.textContent = 'N/A'
    $accuracy.style.color = '#333'
    currentPosition.reset()
    navigator.geolocation.clearWatch(watchId)
  }
})

onClick($startOrPause, async () => {
  if (surveyStatus.isStarted) {
    surveyStatus.paused()
    return
  }

  // On iOS Safari you must request permission
  // You can only request permission after a user action
  if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
    const permissionState = await DeviceOrientationEvent.requestPermission()

    if (permissionState !== 'granted') {
      alert('Device orientation permission is required, please allow!')
    }
  }

  window.addEventListener('deviceorientationabsolute', event => {
    let heading = 0

    // Fix for chrome on non-mobile - for testing
    if (event.alpha !== null) {
      heading = invertBearing(event.alpha)
    }

    updateOrientation(
      heading,
      'Absolute device orientation',
      true,
    )
  })

  const maybeAbsoluteDeviceOrientationHandler = event => {
    if (typeof event.webkitCompassHeading !== 'undefined') {
      updateOrientation(
        event.webkitCompassHeading,
        'Webkit compass heading',
        true,
      )
      return
    }

    if (event.absolute) {
      updateOrientation(invertBearing(event.alpha), 'Device orientation', true)
      return
    }

    window.removeEventListener(
      'deviceorientation',
      maybeAbsoluteDeviceOrientationHandler,
    )
  }

  window.addEventListener(
    'deviceorientation',
    maybeAbsoluteDeviceOrientationHandler,
  )

  surveyStatus.starting()

  watchId = navigator.geolocation.watchPosition(
    position => {
      currentPosition.value = position.coords

      positions.push({
        latitude: currentPosition.value.latitude,
        longitude: currentPosition.value.longitude,
        time: new Date(),
      })

      const acc = Math.round(currentPosition.value.accuracy)
      $accuracy.textContent = `${acc}m`

      surveyStatus.started()

      if (acc < 10) {
        $accuracy.style.color = '#c1e1c1'
      } else if (acc < 20) {
        $accuracy.style.color = '#ffb347'
      } else {
        $accuracy.style.color = '#ff6961'
      }

      // If we aren't able to get the orientation from the device, fall back to the heading
      if (!isOrientationExact) {
        const heading = currentPosition.value.heading

        // Some geolocation methods don't support heading
        if (heading === null) {
          return
        }

        // If we haven't moved, heading can be NAN
        if (isNaN(heading)) {
          return
        }

        orientation.value = {
          degrees: heading,
          provider: 'GPS heading',
          isExact: false,
        }
      }
    },
    event => {
      surveyStatus.error()

      if (event.code === event.PERMISSION_DENIED) {
        alert(`GPS permission denied: ${event.message}`)
        return
      }

      if (event.code === event.POSITION_UNAVAILABLE) {
        alert(`GPS position unavailable: ${event.message}`)
        return
      }

      if (event.code === event.TIMEOUT) {
        alert(`GPS position timeout: ${event.message}`)
      }
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
    },
  )
})

/*
DONE
*/

const surveyStart = new Date()

const getFormattedDate = () =>
  new Date().toISOString().slice(0, 19).replace('T', '-').replace(/:/g, '')

const $done = document.querySelector('#done')

onClick($done, () => {
  surveyStatus.finishing()

  const contents = getOsmFile(
    document.implementation,
    xml => new XMLSerializer().serializeToString(xml),
    addresses.value,
    notes.value,
    surveyStart,
  )

  saveAs(
    new Blob([contents], {type: 'application/vnd.osm+xml'}),
    `${getFormattedDate()}.osm`,
  )

  surveyStatus.finished()

  addresses.reset()
  notes.reset()

  window.location.reload()
})

/*
CLEAR
*/

const $clear = document.querySelector('#clear')

onTouch($clear, () => {
  $currentNumberOrName.value = ''
})

/*
ORIENTATION
*/

const $orientation = document.querySelector('#orientation')
let isOrientationExact = false

orientation.subscribe(({value: {degrees, provider, isExact}}) => {
  $orientation.textContent = `${Math.round(degrees)}°`
  $orientationProvider.textContent = provider
  isOrientationExact = isExact
})

const invertBearing = bearing => Math.abs(bearing - 360)

const updateOrientation = (degrees, provider, isExact) => {
  orientation.value = {
    degrees,
    provider,
    isExact,
  }
}

/*
UNDO
*/

const $undo = document.querySelector('#undo')

onTouch($undo, () => {
  const address = addresses.pop()
  if (address !== undefined) {
    addAction(`- ${address.direction} ${address.numberOrName}`)
  }
})

/*
NOTE
*/

const $addNote = document.querySelector('#add-note')
const $noteWriter = document.querySelector('#note-writer')
const $noteContent = document.querySelector('#note-content')
const $saveNote = document.querySelector('#save-note')
const $closeNoteWriter = document.querySelector('#close-note-writer')

onTouch($addNote, () => {
  if (currentPosition.value === undefined) {
    alert('No GPS')
    return
  }

  $noteWriter.style.display = 'flex'
})

onClick($saveNote, () => {
  notes.add({
    latitude: currentPosition.value.latitude,
    longitude: currentPosition.value.longitude,
    content: $noteContent.value,
  })
  $noteContent.value = ''
  $noteWriter.style.display = 'none'

  addAction('+ note')
})

onClick($closeNoteWriter, () => {
  $noteContent.value = ''
  $noteWriter.style.display = 'none'
})

/*
MAP
*/

const $mapContainer = document.querySelector('#map-container')
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [0, 0],
    zoom: 19,
  }),
})

const positionFeature = new Feature()
positionFeature.setStyle(
  new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: '#3399CC',
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 2,
      }),
    }),
  }),
)

const positionLayer = new VectorLayer({
  source: new VectorSource({
    features: [positionFeature],
  }),
})

map.addLayer(positionLayer)

const addressSource = new VectorSource({features: []})

const addressLayer = new VectorLayer({
  source: addressSource,
})

map.addLayer(addressLayer)

const addressMarkerStyle = new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({
      color: '#0000ff',
    }),
    stroke: new Stroke({
      color: '#000',
      width: 2,
    }),
  }),
})

addresses.subscribe(({value}) => {
  addressSource.clear()

  addressSource.addFeatures(value.map(address => {
    const feature = new Feature({
      geometry: new Point(fromLonLat([address.longitude, address.latitude])),
    })

    feature.setStyle(addressMarkerStyle)

    return feature
  }))
})

const noteSource = new VectorSource({features: []})

const noteLayer = new VectorLayer({
  source: noteSource,
})

map.addLayer(noteLayer)

const noteMarkerStyle = new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({
      color: '#ff0000',
    }),
    stroke: new Stroke({
      color: '#000',
      width: 2,
    }),
  }),
})

notes.subscribe(({value}) => {
  noteSource.clear()

  noteSource.addFeatures(value.map(note => {
    const feature = new Feature({
      geometry: new Point(fromLonLat([note.longitude, note.latitude])),
    })

    feature.setStyle(noteMarkerStyle)

    return feature
  }))
})

currentPosition.subscribe(({value}) => {
  const coords = fromLonLat([value.longitude, value.latitude])
  positionFeature.setGeometry(new Point(coords))
  map.getView().setCenter(coords)
})

onClick(document.querySelector('#show-map'), () => {
  $mapContainer.style.display = 'block'
})

onClick(document.querySelector('#hide-map'), () => {
  $mapContainer.style.display = 'none'
})

/*
LOGS
*/

const $logs = document.querySelector('#logs')
onClick(document.querySelector('#show-logs'), () => {
  $logs.value = state.logs.value
    .map(log => `${log.time.toISOString()}: ${log.message}${log.data ? `\n${JSON.stringify(log.data, undefined, 2)}` : ''}`)
    .join('\n')
})

const statesToSubscribe = {
  addresses: state.addresses,
  notes: state.notes,
  surveyStatus: state.surveyStatus,
  overpassTimeout: state.overpassTimeout,
  overpassEndpoint: state.overpassEndpoint,
  distance: state.distance,
  streetSearchDistance: state.streetSearchDistance,
  streets: state.streets,
}

for (const [name, stateValue] of Object.entries(statesToSubscribe)) {
  stateValue.subscribe(({value, previous}) => {
    if (Array.isArray(value)) {
      // Bad hack
      if (name === 'streets') {
        logger.log(`${name} added`, value)
        return
      }

      if (value.length === previous.length + 1) {
        // At the moment array states can only be added to one at a time
        logger.log(`${name} added`, value[value.length - 1])
        return
      }

      if (value.length === previous.length - 1) {
        // At the moment array states can only be popped, one at a time
        logger.log(`${name} removed`, previous[previous.length - 1])
        return
      }

      logger.log(`${name} unknown update`)
      return
    }

    if (typeof value === 'object') {
      logger.log(`${name} changed`, value)
      return
    }

    logger.log(`${name} changed from ${previous} to ${value}`)
  })
}
