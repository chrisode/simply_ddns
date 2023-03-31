let disabled = false;

function log(...str) {
  if (!disabled) {
    console.log(...str); // eslint-disable-line no-console
  }
}

function logError(...str) {
  console.error(...str); // eslint-disable-line no-console
}

function disableLog() {
  disabled = true;
}

export { log, logError, disableLog };
