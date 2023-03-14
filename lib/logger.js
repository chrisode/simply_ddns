
class Logger {

  constructor(isNotImported) {
    this.isNotImported = isNotImported;
  }

  log(...str) {
    if (this.isNotImported) {
      console.log(...str);
    }
  }

  error(...str) {
    if (this.isNotImported) {
      console.error(...str);
    }
  }

}

export default Logger;