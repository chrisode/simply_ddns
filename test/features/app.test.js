import nock from "nock";
import { readFile, writeFile } from "fs/promises";

import app from "../../app.js";


Feature("Update simply dns records", () => {

  Scenario("Read domains.json and update all records from that", () => {
    const configFilePath = "./config.json";
    let orgConfigFile;
    let calledPath = "", headers = {};

    before(async () => {
      try {
        orgConfigFile = await readFile(configFilePath);
      } catch {
        orgConfigFile = "{}"
      }     
    });

    after(async () => {
      await writeFile(configFilePath, orgConfigFile);
    });

    When("Configfile exists", async () => {
      const config = {
        "account": "kaka",
        "apikey": "kaka",
        "domains": {"example.com": ["kaka.example.com"]}
      };
      await writeFile(configFilePath, JSON.stringify(config));
    });

    And("Simply api is available", async () => {
      const fake = nock("https://api.simply.com");
      
      await fake.post("/2/ddns/").query(true).reply(201, function (path) {
        calledPath = path;
        headers = this.req.headers

        return "OK";
      });
    });

    Then("it should run", async () => {
      await app()
    });

    And("Simply api should have been called", () => {
      expect(calledPath).to.not.equal("");
    });

    And("It should have updated the correct domain", () => {
      expect(calledPath).to.equal("/2/ddns/?domain=example.com&hostname=kaka.example.com");
    });

    And("It should have provided basic auth headers", () => {
      expect(headers).to.have.property("authorization").and.equal("Basic a2FrYTprYWth")
    });

  });

});
