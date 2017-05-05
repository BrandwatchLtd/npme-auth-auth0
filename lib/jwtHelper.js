'use strict';

const jwt = require('jsonwebtoken');
const appConfig = require('./appConfig');

exports.decode = (token) => {
    try {
        return jwt.verify(token, appConfig.auth0Secret);
    } catch (err) {
        console.error('error verifying jwt', err, token); // eslint-disable-line no-console
        return null;
    }
};
