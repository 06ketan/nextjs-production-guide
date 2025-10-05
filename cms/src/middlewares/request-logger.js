"use strict";

/**
 * Request logger middleware
 * Logs all API requests with timing and user info
 */

const formatDuration = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const start = Date.now();
    const requestId = Math.random().toString(36).substring(7);

    // Log request
    const reqLog = {
      requestId,
      method: ctx.request.method,
      url: ctx.request.url,
      query: ctx.request.query,
      ip: ctx.request.ip,
      userAgent: ctx.request.headers["user-agent"]?.substring(0, 100),
    };

    if (ctx.state?.user) {
      reqLog.user = {
        id: ctx.state.user.id,
        email: ctx.state.user.email,
      };
    }

    strapi.log.debug(`[REQ:${requestId}] ${ctx.request.method} ${ctx.request.url}`);

    await next();

    const duration = Date.now() - start;

    // Log response
    const resLog = {
      requestId,
      status: ctx.response.status,
      duration: formatDuration(duration),
    };

    const level = ctx.response.status >= 400 ? "warn" : "debug";
    strapi.log[level](
      `[RES:${requestId}] ${ctx.response.status} - ${formatDuration(duration)}`
    );

    // Log slow requests
    if (duration > 1000) {
      strapi.log.warn(
        `[SLOW:${requestId}] ${ctx.request.method} ${ctx.request.url} took ${formatDuration(duration)}`
      );
    }
  };
};

