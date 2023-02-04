export class State {
  constructor(storage) {
    this.overpassTimeout = new OverpassTimeout(storage)
    this.overpassEndpoint = new OverpassEndpoint(storage)
    this.distance = new Distance(storage)
    this.streetSearchDistance = new StreetSearchDistance(storage)
  }
}

class Value {
  #storage
  #listeners = []
  #value

  constructor(storage) {
    this.#storage = storage
  }

  #notify() {
    for (const listener of this.#listeners) {
      listener(this.#value)
    }
  }

  #store() {
    this.#storage.set(this.storageKey, this.#value)
  }

  subscribe(listener) {
    this.#listeners.push(listener)
  }

  get value() {
    if (this.#value === undefined) {
      this.#value = this.#storage.get(this.storageKey, this.defaultValue)
    }

    return this.#value
  }

  set value(value) {
    if (value === this.#value) {
      return
    }

    this.#value = value
    this.#notify()
    this.#store()
  }

  reset() {
    this.value = this.defaultValue
  }
}

class NumberValue extends Value {
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

class OverpassEndpoint extends Value {
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
