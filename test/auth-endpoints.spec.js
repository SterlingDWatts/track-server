/* eslint-disable mocha/no-setup-in-describe */
/* eslint-disable no-undef */
const mongoose = require("mongoose");
const supertest = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const User = require("../src/models/User");

describe("Auth Endpoints", function () {
  const testUser = { email: "test@test.com", password: "aAbBcc1d!", firstName: "Sterling", lastName: "Watts" };

  before("make mongoose instance", function () {
    mongoose.connect(process.env.TEST_DATABASE_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  after("close mongoose connection", function () {
    mongoose.disconnect();
  });

  afterEach(async function () {
    await User.deleteMany({ email: testUser.email });
  });

  describe("POST /signup", function () {
    context("User validation", function () {
      const requiredFields = ["email", "firstName", "lastName", "password"];
      requiredFields.forEach((field) => {
        it(`responds with 422 when ${field} is missing`, function () {
          const userWithMissingField = { ...testUser };
          delete userWithMissingField[field];
          return supertest(app)
            .post("/signup")
            .send(userWithMissingField)
            .expect(422, { error: `User validation failed: ${field}: Path \`${field}\` is required.` });
        });
      });

      it("responds with 422 when email is not unique", async function () {
        await new User(testUser).save();
        return supertest(app)
          .post("/signup")
          .send(testUser)
          .expect(422, {
            error: `E11000 duplicate key error collection: myFirstDatabase.users index: email_1 dup key: { email: "${testUser.email}" }`,
          });
      });
    });

    context("Happy path", function () {
      it("responds 201 and JWT auth token", function () {
        return supertest(app)
          .post("/signup")
          .send(testUser)
          .expect(201)
          .expect(async (res) => {
            const newUser = await User.findOne({ email: testUser.email }, "_id").exec();
            const expectedToken = jwt.sign({ userId: newUser._id }, process.env.JWT_KEY);
            expect(res.body.token).to.equal(expectedToken);
          });
      });
    });
  });

  describe("Post /signin", function () {
    context("Happy path", function () {
      it("responds with 200 and JWT auth token when given valid credentials", async function () {
        const user = await new User(testUser).save();
        const expectedToken = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
        return supertest(app).post("/signIn").send({ email: testUser.email, password: testUser.password }).expect(200, {
          token: expectedToken,
        });
      });
    });
  });
});
