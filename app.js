import { fileURLToPath } from "url";

import checkIP from "./lib/checkIP.js";
import getConfig from "./lib/getConfig.js";
import { log, disableLog } from "./lib/logger.js";
import { updateHostname } from "./lib/simplyApi.js";

const isImported = process.argv[1] !== fileURLToPath(import.meta.url);
if (isImported) {
  disableLog();
}

async function updateDomains() {
  const config = await getConfig();

  for (const [ domain, hostnames ] of Object.entries(config.domains)) {
    hostnames.forEach((hostname) => {
      updateHostname(domain, hostname);
    });
  }
}

async function app() {
  const isNewIP = await checkIP();
  if (!isNewIP) {
    log("IP has not changed, aborting...");
    return;
  }
  await updateDomains();
}

// Only run if called from terminal, not if imported
if (!isImported) {
  await app();
}

export default app;
