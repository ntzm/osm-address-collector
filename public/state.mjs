export class State {
  constructor(storage) {
    this.addresses = new Addresses(storage)
    this.notes = new Notes(storage)
    this.surveyStatus = new SurveyStatus()
    this.overpassTimeout = new OverpassTimeout(storage)
    this.overpassEndpoint = new OverpassEndpoint(storage)
    this.distance = new Distance(storage)
    this.streetSearchDistance = new StreetSearchDistance(storage)
  }
}

class Value {
  #listeners = []
  val

  #notify() {
    for (const listener of this.#listeners) {
      listener(this.val)
    }
  }

  subscribe(listener) {
    this.#listeners.push(listener)
  }

  get value() {
    return this.val
  }

  set value(value) {
    if (value === this.val) {
      return
    }

    this.val = value
    this.#notify()
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
    this.#storage.set(this.storageKey, this.val)
  }

  get value() {
    if (this.val === undefined) {
      this.val = this.#storage.get(this.storageKey, this.defaultValue)
    }

    return this.val
  }

  set value(value) {
    super.value = value

    if (value !== this.val) {
      this.#store()
    }
  }
}

class JsonValue extends SavedValue {
  get value() {
    return JSON.parse(super.value)
  }

  set value(value) {
    super.value = JSON.stringify(value)
  }
}

class Addresses extends JsonValue {
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

class Notes extends JsonValue {
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

class NumberValue extends SavedValue {
  get value() {
    return Number(super.value)
  }

  set value(value) {
    super.value = Number(value)
  }
}

class OverpassTimeout extends NumberValue {
  storageKey = 'overpassTimeout'
  defaultValue = 10_000
}

class OverpassEndpoint extends SavedValue {
  storageKey = 'overpassEndpoint'
  defaultValue = 'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
}

class Distance extends NumberValue {
  storageKey = 'distance'
  defaultValue = 10
}

class StreetSearchDistance extends NumberValue {
  storageKey = 'streetSearchDistance'
  defaultValue = 10
}
