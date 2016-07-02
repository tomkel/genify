const winston = require('winston')

const log = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      timestamp: true,
    }),
  ],
})

module.exports = log
