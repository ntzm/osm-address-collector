export default class Store {
  engine

  constructor(engine: Storage) {
    this.engine = engine
  }

  get(key: string, def?: any) {
    return this.engine.getItem(key) ?? def
  }

  getJson(key: string, def: any) {
    const value = this.get(key)

    if (value === undefined) {
      return def
    }

    return JSON.parse(value)
  }

  set(key: string, value: string) {
    try {
      this.engine.setItem(key, value)
    } catch {
      alert('Address storage is full, please finish and start a new survey')
    }
  }

  setJson(key: string, value: any) {
    this.set(key, JSON.stringify(value))
  }
}
