export default class Storage {
  constructor(engine) {
    this.engine = engine
  }

  get(key, def) {
    return this.engine.getItem(key) ?? def
  }

  getNumber(key, def) {
    return Number(this.get(key, def))
  }

  getJson(key, def) {
    const value = this.get(key)

    if (value === undefined) {
      return def
    }

    return JSON.parse(value)
  }

  set(key, value) {
    this.engine.setItem(key, value)
  }

  setJson(key, value) {
    this.set(key, JSON.stringify(value))
  }
}
