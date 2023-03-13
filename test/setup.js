// Setup common test libraries
import "mocha-cakes-2";

import chai from "chai";
global.expect = chai.expect;

import nock from "nock";
nock.disableNetConnect();
nock.enableNetConnect(
  host => host.includes("simply.com")
)
