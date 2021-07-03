process.env.TZ = "UTC";
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "a6ce5309-c8ef-462c-a9d7-89c816efb675";
process.env.JWT_EXPIRY = "2h";
process.env.TEST_DATABSE_URL = process.env.TEST_DATABASE_URL || "postgresql://example-test";

require("dotenv").config();
const { expect } = require("chai");
const supertest = require("supertest");

global.expect = expect;
global.supertest = supertest;
