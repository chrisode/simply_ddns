// Setup common test libraries
import "mocha-cakes-2";

import chai from "chai";
import nock from "nock";

global.expect = chai.expect;
nock.disableNetConnect();
nock.enableNetConnect(
  (host) => host.includes("simply.com")
);
