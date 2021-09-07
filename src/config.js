module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://pleaseUpdateMe",
  JWT_KEY: process.env.JWT_KEY || "3bb74d82-d545-4f01-8df0-c801f2b7a32d",
};
