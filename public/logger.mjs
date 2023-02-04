export default class Logger {
  constructor(logs) {
    this.logs = logs
  }

  log(message, data) {
    const toConsole = [message]
    if (data) {
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
