'use strict';

const winston = require('winston');
const appConfig = require('./appConfig');

const Rotate = require('winston-logrotate').Rotate;
const logLevel = appConfig.logLevel || 'info';

module.exports = new winston.Logger({
    transports: [
        new winston.transports.Console({
            timestamp: true,
            colorize: true,
            level: logLevel
        }),
        new Rotate({
            file: '/tmp/npme-auth-auth0.log',
            timestamp: true,
            level: logLevel,
            keep: 28
        })
    ]
});
