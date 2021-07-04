const xss = require("xss");

// eslint-disable-next-line no-useless-escape
const REGEX_PASSWORD = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const AuthService = {
  validatePassword(password) {
    if (password.length < 8 || password.length > 72) {
      return "Password must be between 8 and 72 characters.";
    } else if (password.includes(" ")) {
      return "Password must not include a space.";
    } else if (!REGEX_PASSWORD.test(password)) {
      return "Password must contain one upper case, lower case, number, and special character.";
    }
    return null;
  },
  serializeUser({ firstName, lastName, email, password }) {
    return {
      firstName: xss(firstName),
      lastName: xss(lastName),
      email: xss(email),
      password,
    };
  },
};

module.exports = AuthService;
