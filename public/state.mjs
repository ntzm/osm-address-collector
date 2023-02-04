export class State {
  constructor(storage) {
    this.addresses = new Addresses(storage)
    this.notes = new Notes(storage)
    this.surveyStatus = new SurveyStatus()
    this.logs = new Logs()
    this.overpassTimeout = new OverpassTimeout(storage)
    this.overpassEndpoint = new OverpassEndpoint(storage)
    this.distance = new Distance(storage)
    this.streetSearchDistance = new StreetSearchDistance(storage)
  }
}

class Value {
  #listeners = []
  val

  #notify(previous) {
    for (const listener of this.#listeners) {
      listener({
        value: this.val,
        previous,
      })
    }
  }

  subscribe(listener) {
    this.#listeners.push(listener)
  }

  get value() {
    return this.val
  }

  set value(value) {
    const previous = this.val

    if (value === previous) {
      return
    }

    this.val = value
    this.#notify(previous)
  }

  reset() {
    this.value = this.defaultValue
  }
}

class SavedValue extends Value {
  #storage

  constructor(storage) {
    super()
    this.#storage = storage
  }

  #store() {
    let toStore = this.val

    if (this.toStored) {
      toStore = this.toStored(toStore)
    }

    this.#storage.set(this.storageKey, toStore)
  }

  get value() {
    if (this.val === undefined) {
      const stored = this.#storage.get(this.storageKey)

      if (stored === undefined) {
        this.val = this.defaultValue
      } else if (this.fromStored) {
        this.val = this.fromStored(stored)
      }
    }

    return this.val
  }

  set value(value) {
    super.value = value

    // Todo only store if changed
    this.#store()
  }
}

class SavedJsonValue extends SavedValue {
  fromStored(stored) {
    return JSON.parse(stored)
  }

  toStored(value) {
    return JSON.stringify(value)
  }
}

class Addresses extends SavedJsonValue {
  storageKey = 'addresses'
  defaultValue = []

  add(address) {
    this.value = [...this.value, address]
  }

  pop() {
    const addresses = this.value
    const popped = addresses[addresses.length - 1]

    this.value = addresses.slice(0, -1)

    return popped
  }
}

class Notes extends SavedJsonValue {
  storageKey = 'notes'
  defaultValue = []

  add(note) {
    this.value = [...this.value, note]
  }
}

export class SurveyStatus extends Value {
  static UNSTARTED = 'unstarted'
  static STARTING = 'starting'
  static STARTED = 'started'
  static PAUSED = 'paused'
  static FINISHING = 'finishing'
  static FINISHED = 'finished'
  static ERROR = 'error'

  get isStarting() {
    return this.value === SurveyStatus.STARTING
  }

  get isStarted() {
    return this.value === SurveyStatus.STARTED
  }

  get isPaused() {
    return this.value === SurveyStatus.PAUSED
  }

  get isFinishing() {
    return this.value === SurveyStatus.FINISHING
  }

  get isFinished() {
    return this.value === SurveyStatus.FINISHED
  }

  get isError() {
    return this.value === SurveyStatus.ERROR
  }

  starting() {
    this.value = SurveyStatus.STARTING
  }

  started() {
    this.value = SurveyStatus.STARTED
  }

  paused() {
    this.value = SurveyStatus.PAUSED
  }

  finishing() {
    this.value = SurveyStatus.FINISHING
  }

  finished() {
    this.value = SurveyStatus.FINISHED
  }

  error() {
    this.value = SurveyStatus.ERROR
  }
}

class Logs extends Value {
  val = []

  add(log) {
    this.value = [...this.value, log]
  }
}

class SavedNumberValue extends SavedValue {
  fromStored = Number
  toStored = Number
}

class OverpassTimeout extends SavedNumberValue {
  storageKey = 'overpassTimeout'
  defaultValue = 10_000
}

class OverpassEndpoint extends SavedValue {
  storageKey = 'overpassEndpoint'
  defaultValue = 'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
}

class Distance extends SavedNumberValue {
  storageKey = 'distance'
  defaultValue = 10
}

class StreetSearchDistance extends SavedNumberValue {
  storageKey = 'streetSearchDistance'
  defaultValue = 10
}
