import {type Logs} from './state'

export default class Logger {
  private readonly logs

  constructor(logs: Logs) {
    this.logs = logs
  }

  log(message: string, data?: any) {
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
