const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");

module.exports.setupSecurity = (app) => {
  app.use(helmet());

  app.use(compression());

  const limiter = rateLimit({
    max: 200,
    windowMs: 15 * 60 * 1000,
    message: "Too many requests from this IP, please try again in 15 minutes",
  });
  app.use("/api", limiter);
};

module.exports.setupSanitization = (app) => {
  app.use((req, res, next) => {
    try {
      mongoSanitize()(req, res, next);
    } catch (error) {
      if (req.body) req.body = mongoSanitize.sanitize(req.body);
      if (req.params) req.params = mongoSanitize.sanitize(req.params);
      next();
    }
  });

  app.use((req, res, next) => {
    try {
      xss()(req, res, next);
    } catch (error) {
      const { clean } = require("xss-clean/lib/xss");
      if (req.body) req.body = clean(req.body);
      if (req.params) req.params = clean(req.params);
      next();
    }
  });
};
