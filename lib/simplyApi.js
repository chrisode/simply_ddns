import axios from "axios";

import getConfig from "./getConfig.js";
import { log, logError } from "./logger.js";

let _instance;

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

async function updateHostname(domain, hostname) {
  try {
    const instance = await getAxiosInstance();
    await instance.post(`/2/ddns/?domain=${domain}&hostname=${hostname}`);
    log(`Succesfully updated hostname ${hostname}`);
  } catch (error) {
    log(`Failed to update hostname ${hostname}`);
    logError(error);
  }
}

export { updateHostname };
