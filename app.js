import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import axios from "axios";

import checkIP from "./lib/checkIP.js";
import Logger from "./lib/logger.js";

let _config, _instance;

const isNotImported = process.argv[1] === fileURLToPath(import.meta.url);
const logger = new Logger(isNotImported);

async function getAxiosInstance() {

  if (_instance) {
    return _instance;
  }

  const config = await getConfig();

  _instance = axios.create({
    baseURL: "https://api.simply.com",
    timeout: 1000,
    responseType: "text",
    auth: {
      username: config.account,
      password: config.apikey,
    },
  });

  return _instance;
}

async function getConfig() {
  if (_config) {
    return _config;
  }
  const configFile = await readFile("./config.json");
  _config = JSON.parse(configFile);
  return _config;
}

async function getDomains() {
  const config = await getConfig();
  return config.domains;
}

async function updateAlHostnames() {

  const domains = await getDomains();

  for (const [ domain, hostnames ] of Object.entries(domains)) {
    hostnames.forEach((hostname) => {
      updateHostname(domain, hostname);
    });
  }
}

async function updateHostname(domain, hostname) {
  try {
    const instance = await getAxiosInstance();
    await instance.post(`/2/ddns/?domain=${domain}&hostname=${hostname}`);
    logger.log(`Succesfully updated hostname ${hostname}`);
  } catch (error) {
    logger.log(`Failed to update hostname ${hostname}`);
    logger.error(error);
  }
}

async function app() {
  const isNewIP = await checkIP();
  if (!isNewIP) {
    logger.log("IP has not changed, aborting...");
    return;
  }
  await updateAlHostnames();
}

// Only run if called from terminal, not if included
if (isNotImported) {
  await app();
}

export default app;
