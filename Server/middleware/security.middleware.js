const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");

module.exports.setupSecurity = (app) => {
  // Set security HTTP headers
  app.use(helmet());

  // Compression
  app.use(compression());

  // Limit requests from same API
  const limiter = rateLimit({
    max: 100,
    windowMs: 15 * 60 * 1000,
    message: "Too many requests from this IP, please try again in 15 minutes",
  });
  app.use("/api", limiter);
};

module.exports.setupSanitization = (app) => {
  // Data sanitization against NoSQL query injection
  // Data sanitization against NoSQL query injection
  app.use((req, res, next) => {
    try {
      mongoSanitize()(req, res, next);
    } catch (error) {
      // Fallback for Express 5 compatibility if req.query is read-only
      if (req.body) req.body = mongoSanitize.sanitize(req.body);
      if (req.params) req.params = mongoSanitize.sanitize(req.params);
      next();
    }
  });

  // Data sanitization against XSS
  app.use((req, res, next) => {
    try {
      xss()(req, res, next);
    } catch (error) {
      // Fallback: manually clean body/params using the internal clean function
      const { clean } = require("xss-clean/lib/xss");
      if (req.body) req.body = clean(req.body);
      if (req.params) req.params = clean(req.params);
      next();
    }
  });
};
