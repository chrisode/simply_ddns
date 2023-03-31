import nock from "nock";
import { readFile, writeFile, unlink } from "fs/promises";

import app from "../../app.js";

Feature("Update simply dns records", () => {
  const configFilePath = "./config/config.json";
  const ipFilePath = "./config/.ip";
  let orgConfigFile, orgIPFile;

  beforeEachScenario(async () => {
    try {
      orgConfigFile = await readFile(configFilePath);
      orgIPFile = await readFile(ipFilePath);
    } catch { } // eslint-disable-line
  });

  afterEachScenario(async () => {
    if (orgConfigFile) {
      await writeFile(configFilePath, orgConfigFile);
    } else {
      unlink(configFilePath);
    }
    if (orgIPFile) {
      await writeFile(ipFilePath, orgIPFile);
    } else {
      unlink(ipFilePath);
    }
  });

  async function fakeConfig() {
    const config = {
      account: "kaka",
      apikey: "kaka",
      domains: { "example.com": [ "kaka.example.com" ] },
    };
    await writeFile(configFilePath, JSON.stringify(config));
  }

  Scenario("First time update of all dns records for specified domains", () => {
    let fakeIPApi, fakeSimplyAPI;
    let calledPath = "", headers = {};

    When("Configfile exists", fakeConfig);

    And("ip file with previos IP doesnt exists", async () => {
      try {
        await unlink(ipFilePath);
      } catch { } // eslint-disable-line
    });

    And("Simply api is available", async () => {
      fakeSimplyAPI = nock("https://api.simply.com");

      await fakeSimplyAPI.post("/2/ddns/").query(true).reply(201, function (path) {
        calledPath = path;
        headers = this.req.headers;

        return "OK";
      });
    });

    And("IP API is available", async () => {
      fakeIPApi = nock("https://api.ipify.org");
      await fakeIPApi.get("/").query({ format: "json" }).reply(200, { ip: "96.69.96.69" });
    });

    Then("it should run", async () => {
      await app();
    });

    And("IP should have been fetched from the API", () => {
      expect(fakeIPApi.isDone()).to.be.true;
    });

    And("Simply api should have been called", () => {
      expect(fakeSimplyAPI.isDone()).to.be.true;
    });

    And("It should have updated the correct domain", () => {
      expect(calledPath).to.equal("/2/ddns/?domain=example.com&hostname=kaka.example.com");
    });

    And("It should have provided basic auth headers", () => {
      expect(headers).to.have.property("authorization").and.equal("Basic a2FrYTprYWth");
    });

    And("It should have created a hidden file, .ip, containing the last fetched IP", async () => {
      let ipFileContent;
      try {
        ipFileContent = await readFile(ipFilePath, "utf-8");
      } catch { } // eslint-disable-line
      expect(ipFileContent).to.equal("96.69.96.69");
    });

  });

  Scenario("Update domains when IP has changed", () => {
    let fakeIPApi, fakeSimplyAPI;

    When("Configfile exists", fakeConfig);

    And("ip file with previos IP does exist", async () => {
      try {
        await writeFile(ipFilePath, "96.69.96.69");
      } catch { } // eslint-disable-line
    });

    And("Simply api is available", async () => {
      fakeSimplyAPI = nock("https://api.simply.com");
      await fakeSimplyAPI.post("/2/ddns/").query(true).reply(201, "OK");
    });

    And("IP API is available", async () => {
      fakeIPApi = nock("https://api.ipify.org");
      await fakeIPApi.get("/").query({ format: "json" }).reply(200, { ip: "92.69.96.69" });
    });

    Then("it should run", async () => {
      await app();
    });

    And("IP should have been fetched from the API", () => {
      expect(fakeIPApi.isDone()).to.be.true;
    });

    And("Simply api should have been called", () => {
      expect(fakeIPApi.isDone()).to.be.true;
    });

    And("It should have updated the IP in the .ip file", async () => {
      let ipFileContent;
      try {
        ipFileContent = await readFile(ipFilePath, "utf-8");
      } catch { } // eslint-disable-line
      expect(ipFileContent).to.equal("92.69.96.69");
    });

  });

  Scenario("Domains should not be updated if ip hasnt changed", () => {
    let fakeIPApi, fakeSimplyAPI;

    When("Configfile exists", fakeConfig);

    And("ip file with previos IP does exist", async () => {
      try {
        await writeFile(ipFilePath, "96.69.96.69");
      } catch { } // eslint-disable-line
    });

    And("Simply api is available", async () => {
      fakeSimplyAPI = nock("https://api.simply.com");
      await fakeSimplyAPI.post("/2/ddns/").query(true).reply(201, "OK");
    });

    And("IP API is available", async () => {
      fakeIPApi = nock("https://api.ipify.org");
      await fakeIPApi.get("/").query({ format: "json" }).reply(200, { ip: "96.69.96.69" });
    });

    Then("it should run", async () => {
      await app();
    });

    And("IP should have been fetched from the API", () => {
      expect(fakeIPApi.isDone()).to.be.true;
    });

    And("Simply api should not have been called", () => {
      expect(fakeSimplyAPI.isDone()).to.not.be.true;
    });
  });
});
