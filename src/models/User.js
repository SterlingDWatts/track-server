const mongoose = require("mongoose");
const xss = require("xss");
const bcrypt = require("bcrypt");
// eslint-disable-next-line no-useless-escape
const REGEX_PASSWORD = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    vailidate: [
      {
        validator: function (password) {
          return password.length < 8 || password.length > 72;
        },
        msg: "Password must be between 8 and 72 characters.",
      },
      {
        validator: function (password) {
          return password.includes(" ");
        },
        msg: "Password must not include a space.",
      },
      {
        validator: function (password) {
          return !REGEX_PASSWORD.test(password);
        },
        msg: "Password must contain one upper case, lower case, number, and special character.",
      },
    ],
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

function serializeUser({ firstName, lastName, email, password }) {
  return {
    firstName: xss(firstName),
    lastName: xss(lastName),
    email: xss(email),
    password,
  };
}

userSchema.pre("save", function (next) {
  const user = serializeUser(this.user);
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return new Promise((resolve, reject) => {
    const user = this;
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      if (!isMatch) {
        return reject(false);
      }
      resolve(true);
    });
  });
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
