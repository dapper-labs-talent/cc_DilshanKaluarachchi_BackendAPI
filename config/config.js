let configuration;

const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'development') {
    configuration = require("./development.js");
}

module.exports = configuration;