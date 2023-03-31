import { readFile } from "fs/promises";

let _config;

async function getConfig() {
  if (_config) {
    return _config;
  }
  const configFile = await readFile("./config/config.json");
  _config = JSON.parse(configFile);
  return _config;
}

export default getConfig;
