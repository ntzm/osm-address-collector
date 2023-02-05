export default class Logger {
  constructor(logs) {
    this.logs = logs
  }

  log(message, data) {
    const toConsole = [message]
    if (data) {
      if (typeof GeolocationCoordinates === 'function' && data instanceof GeolocationCoordinates) {
        data = {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy,
        }
      }

      toConsole.push(data)
    }

    console.log(...toConsole)
    this.logs.add({
      message,
      time: new Date(),
      data,
    })
  }
}
