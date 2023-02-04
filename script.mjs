import findNearestStreets from './find-nearest-streets.mjs'
import {compassHeading, move} from './geo.mjs'
import guessNextNumber from './guess-next-number.mjs'
import {getOsmFile} from './osm-xml.mjs'
import Storage from './storage.mjs'
import saveAs from './vendor/file-saver.mjs'

const storage = new Storage(localStorage)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
}

const onClick = ($element, callback, requiresInteraction) => {
  if (!requiresInteraction) {
    $element.addEventListener('touchstart', event => {
      event.preventDefault()
      callback(event)
    })
  }

  $element.addEventListener('click', callback)
}

const $container = document.querySelector('#main')

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

const overpassTimeoutKey = 'overpassTimeout'
const defaultOverpassTimeout = 10_000
let overpassTimeout = storage.getNumber(overpassTimeoutKey, defaultOverpassTimeout)
const $overpassTimeout = document.querySelector('#overpass-timeout')
$overpassTimeout.value = overpassTimeout

$overpassTimeout.addEventListener('blur', () => {
  overpassTimeout = Number($overpassTimeout.value)
  storage.set(overpassTimeoutKey, overpassTimeout)
})

const overpassEndpointKey = 'overpassEndpoint'
const defaultOverpassEndpoint = 'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
let overpassEndpoint = storage.get(overpassEndpointKey, defaultOverpassEndpoint)
const $overpassEndpoint = document.querySelector('#overpass-endpoint')
$overpassEndpoint.value = overpassEndpoint

$overpassEndpoint.addEventListener('blur', () => {
  overpassEndpoint = $overpassEndpoint.value
  storage.set(overpassEndpointKey, overpassEndpoint)
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

const distanceKey = 'distance'
const defaultDistance = 10
const $distance = document.querySelector('#distance')
let distance = storage.getNumber(distanceKey, defaultDistance)
$distance.value = distance

const $distanceDisplay = document.querySelector('#distance-display')
$distanceDisplay.textContent = distance

$distance.addEventListener('input', () => {
  distance = Number($distance.value)
  $distanceDisplay.textContent = distance
  storage.set(distanceKey, distance)
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

const $streets = document.querySelector('#streets')
const $street = document.querySelector('#street')
const $updateStreets = document.querySelector('#update-streets')
const $updateStreetsStatus = document.querySelector('#update-streets-status')

const streetSearchDistanceKey = 'streetSearchDistance'
const defaultStreetSearchDistance = 10
let streetSearchDistance = storage.getNumber(streetSearchDistanceKey, defaultStreetSearchDistance)
const $streetSearchDistance = document.querySelector('#street-search-distance')
$streetSearchDistance.value = streetSearchDistance

const $streetSearchDistanceDisplay = document.querySelector('#street-search-distance-display')
$streetSearchDistanceDisplay.textContent = streetSearchDistance

$streetSearchDistance.addEventListener('input', () => {
  const temporaryStreetSearchDistance = Number($streetSearchDistance.value)
  streetSearchDistance = temporaryStreetSearchDistance
  $streetSearchDistanceDisplay.textContent = streetSearchDistance
  storage.set(streetSearchDistanceKey, streetSearchDistance)
})

$street.addEventListener('focus', () => {
  $street.value = ''
})

onClick($updateStreets, async () => {
  if (currentPosition === null) {
    $updateStreetsStatus.textContent = 'GPS required'
    $updateStreetsStatus.classList.add('status--bad')
    return
  }

  $updateStreets.disabled = true
  $updateStreetsStatus.textContent = 'Updating streets...'
  $updateStreetsStatus.classList.remove('status--good', 'status--bad')

  let nearestStreets

  try {
    nearestStreets = await findNearestStreets(
      currentPosition,
      streetSearchDistance,
      overpassEndpoint,
      overpassTimeout,
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

  $updateStreetsStatus.textContent = `Found ${nearestStreets.length} street${nearestStreets.length === 1 ? '' : 's'}`
  $updateStreetsStatus.classList.add('status--good')

  $streets.replaceChildren(
    ...nearestStreets.map(street => {
      const $option = document.createElement('option')
      $option.value = street
      return $option
    }),
  )
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

  // This sucks - react would be lovely here

  overpassTimeout = defaultOverpassTimeout
  $overpassTimeout.value = defaultOverpassTimeout
  storage.set(overpassTimeoutKey, defaultOverpassTimeout)

  overpassEndpoint = defaultOverpassEndpoint
  $overpassEndpoint.value = defaultOverpassEndpoint
  storage.set(overpassEndpointKey, defaultOverpassEndpoint)

  distance = defaultDistance
  $distance.value = defaultDistance
  $distanceDisplay.textContent = defaultDistance
  storage.set(distanceKey, defaultDistance)

  streetSearchDistance = defaultStreetSearchDistance
  $streetSearchDistance.value = defaultStreetSearchDistance
  $streetSearchDistanceDisplay.textContent = defaultStreetSearchDistance
  storage.set(streetSearchDistanceKey, defaultStreetSearchDistance)

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

const saveAddresses = addressesToSave =>
  storage.setJson('addresses', addressesToSave)

const getSavedAddresses = () =>
  storage.getJson('addresses', [])

const saveNotes = notesToSave =>
  storage.setJson('notes', notesToSave)

const getSavedNotes = () =>
  storage.getJson('notes', [])

let notes = []

const $currentNumberOrName = document.querySelector('#current-number-or-name')
let addresses = []
let lastSkippedNumbers = []
let numberIsGuessed = false
let currentPosition = null
let currentOrientation = null

const savedAddresses = getSavedAddresses()
const savedNotes = getSavedNotes()

if (savedAddresses.length + savedNotes.length > 0) {
  if (confirm(`You have ${savedAddresses.length} unsaved addresses and ${savedNotes.length} unsaved notes from the previous session, do you want to load them?`)) {
    addresses = savedAddresses
    notes = savedNotes
  } else {
    saveAddresses([])
    saveNotes([])
  }
}

$currentNumberOrName.addEventListener('focus', () => {
  if (numberIsGuessed) {
    $currentNumberOrName.classList.remove('guessed')
    $currentNumberOrName.value = ''
  }
})

for (const append of document.querySelectorAll('.append')) {
  onClick(append, () => {
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
  onClick(submit, () => {
    if (currentPosition === null) {
      alert('No GPS')
      return
    }

    const numberOrName = $currentNumberOrName.value

    if (numberOrName === '') {
      alert('No number or name')
      return
    }

    let bearing = currentOrientation

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

    const newPosition = move(currentPosition, bearing, distance)

    addresses.push({
      latitude: newPosition.latitude,
      longitude: newPosition.longitude,
      numberOrName,
      customTags,
      direction,
      skippedNumbers: lastSkippedNumbers,
      street: $street.value,
    })
    saveAddresses(addresses)

    addAction(`+ ${direction} ${numberOrName}`)

    let guessedNextNumber;
    [guessedNextNumber, lastSkippedNumbers] = guessNextNumber(addresses, skipNumbers)

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
let started = false
let watchId
const $accuracy = document.querySelector('#accuracy')
const positions = []

onClick($startOrPause, async () => {
  if (started) {
    $startOrPause.textContent = 'Start'
    currentPosition = null
    navigator.geolocation.clearWatch(watchId)
    $accuracy.textContent = 'N/A'
    $accuracy.style.color = '#333'
    started = false
    $container.classList.remove('started')
    addAction('Paused')
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
    updateOrientation(
      compassHeading(event.alpha, event.beta, event.gamma),
      'Absolute device orientation',
      true,
    )
  })

  const maybeAbsoluteDeviceOrientationHandler = event => {
    if (typeof event.webkitCompassHeading !== 'undefined') {
      updateOrientation(event.webkitCompassHeading, 'Webkit compass heading', true)
      return
    }

    if (event.absolute) {
      updateOrientation(compassHeading(event.alpha, event.beta, event.gamma), 'Device orientation', true)
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

  $startOrPause.textContent = 'Starting'
  addAction('Started')

  watchId = navigator.geolocation.watchPosition(
    position => {
      currentPosition = position.coords

      positions.push({
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        time: new Date(),
      })

      const acc = Math.round(currentPosition.accuracy)
      $accuracy.textContent = `${acc}m`

      $startOrPause.textContent = 'Pause'
      started = true
      $container.classList.add('started')

      if (acc < 10) {
        $accuracy.style.color = '#c1e1c1'
      } else if (acc < 20) {
        $accuracy.style.color = '#ffb347'
      } else {
        $accuracy.style.color = '#ff6961'
      }

      // If we aren't able to get the orientation from the device, fall back to the heading
      if (!isOrientationExact) {
        const heading = currentPosition.heading

        // Some geolocation methods don't support heading
        if (heading === null) {
          return
        }

        // If we haven't moved, heading can be NAN
        if (isNaN(heading)) {
          return
        }

        updateOrientation(heading, 'GPS heading', false)
      }
    },
    event => {
      $startOrPause.textContent = 'Start'

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
}, true)

/*
DONE
*/

const surveyStart = new Date()

const getFormattedDate = () =>
  new Date().toISOString().slice(0, 19).replace('T', '-').replace(/:/g, '')

onClick(document.querySelector('#done'), () => {
  if (addresses.length > 0) {
    const contents = getOsmFile(
      document.implementation,
      xml => new XMLSerializer().serializeToString(xml),
      addresses,
      notes,
      surveyStart,
    )

    saveAs(
      new Blob([contents], {type: 'application/vnd.osm+xml'}),
      `${getFormattedDate()}.osm`,
    )
  }

  saveAddresses([])
  saveNotes([])

  window.location.reload()
}, true)

/*
CLEAR
*/

onClick(document.querySelector('#clear'), () => {
  $currentNumberOrName.value = ''
})

/*
ORIENTATION
*/

const $orientation = document.querySelector('#orientation')
let isOrientationExact = false

const updateOrientation = (orientation, provider, isExact) => {
  currentOrientation = Math.round(orientation)
  $orientation.textContent = `${currentOrientation}°`
  $orientationProvider.textContent = provider
  isOrientationExact = isExact
}

/*
UNDO
*/

onClick(document.querySelector('#undo'), () => {
  const address = addresses.pop()
  if (address !== undefined) {
    saveAddresses(addresses)
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

onClick($addNote, () => {
  if (currentPosition === null) {
    alert('No GPS')
    return
  }

  $noteWriter.style.display = 'flex'
})

onClick($saveNote, () => {
  notes.push({
    latitude: currentPosition.latitude,
    longitude: currentPosition.longitude,
    content: $noteContent.value,
  })
  saveNotes(notes)
  $noteContent.value = ''
  $noteWriter.style.display = 'none'

  addAction('+ note')
})

onClick($closeNoteWriter, () => {
  $noteContent.value = ''
  $noteWriter.style.display = 'none'
})
