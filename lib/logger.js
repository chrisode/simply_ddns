class Logger {

  constructor(isNotImported) {
    this.isNotImported = isNotImported;
  }

  log(...str) {
    if (this.isNotImported) {
      console.log(...str); // eslint-disable-line no-console
    }
  }

  error(...str) {
    if (this.isNotImported) {
      console.error(...str); // eslint-disable-line no-console
    }
  }

}

export default Logger;
