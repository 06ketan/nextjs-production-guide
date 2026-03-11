const path = require("path");

module.exports = ({ env }) => {
  return {
    connection: {
      client: "postgres",
      connection: {
        connectionString: env("DATABASE_URL", ""),
        // ssl: env.bool("DATABASE_SSL", false) ? {
        //   rejectUnauthorized: env.bool("DATABASE_SSL_REJECT_UNAUTHORIZED", false)
        // } : false,
      },

      // acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000),
    },
  };
};
