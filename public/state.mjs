export class State {
  constructor(storage) {
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
