let hasLogged = false;

const logStartupValues = () => {
  if (!hasLogged) {
    console.dir({
      NODE_ENV: process.env.NODE_ENV,
      STRAPI_URL: process.env.STRAPI_URL,
      STRAPI_TOKEN: process.env.STRAPI_TOKEN ? "[SET]" : "[NOT SET]",
      STRAPI_WEBHOOK_SECRET: process.env.STRAPI_WEBHOOK_SECRET
        ? "[SET]"
        : "[NOT SET]",
      REDIS_URL: process.env.REDIS_URL,
      REDIS_CLUSTER_URLS: process.env.REDIS_CLUSTER_URLS,
      REDIS_CACHE_DEBUG: process.env.REDIS_CACHE_DEBUG,
      AZURE_REDIS_CONNECTION_STRING: process.env.AZURE_REDIS_CONNECTION_STRING
        ? "[SET]"
        : "[NOT SET]",
      BUILD_ID: process.env.BUILD_ID,
      REDIS_FLUSH_AUTH_TOKEN: process.env.REDIS_FLUSH_AUTH_TOKEN
        ? "[SET]"
        : "[NOT SET]",
    });

    hasLogged = true;
  }
};

export default logStartupValues;
