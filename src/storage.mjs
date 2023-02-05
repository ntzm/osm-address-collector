export default class Storage {
  constructor(engine) {
    this.engine = engine
  }

  get(key, def) {
    return this.engine.getItem(key) ?? def
  }

  getJson(key, def) {
    const value = this.get(key)

    if (value === undefined) {
      return def
    }

    return JSON.parse(value)
  }

  set(key, value) {
    try {
      this.engine.setItem(key, value)
    } catch {
      alert('Address storage is full, please finish and start a new survey')
    }
  }

  setJson(key, value) {
    this.set(key, JSON.stringify(value))
  }
}
