import { readFile } from "fs/promises";
import axios from "axios";

let _config, _instance;

async function getInstance() {

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
      password: config.apikey
    }
  });

  return _instance;
}

async function getConfig() {
  if (_config) {
    return _config;
  }
  const configFile = await readFile("./config.json")
  _config = JSON.parse(configFile);
  return _config;
}

async function getDomains() {
  const config = await getConfig();
  return config.domains;
}

async function updateAlHostnames() {

  const domains = await getDomains();

  for (const [domain, hostnames] of Object.entries(domains)) {
    hostnames.forEach((hostname) => {
      updateHostname(domain, hostname);
    });
  }
}

async function updateHostname(domain, hostname) {
  try {
    const instance = await getInstance();
    const response = await instance.post(`/2/ddns/?domain=${domain}&hostname=${hostname}`);
    console.log(`Succesfully updated hostname ${hostname}`);
  } catch (error) {
    console.log(`Failed to update hostname ${hostname}`);
    console.error(error);
  }
}

async function app() {
  await updateAlHostnames();
}

export default app;