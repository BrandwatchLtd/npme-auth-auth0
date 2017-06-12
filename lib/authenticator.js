'use strict';

const axios = require('axios');
const appConfig = require('./appConfig');
const logger = require('./logger');

module.exports = class Authenticator {
    authenticate(credentials, cb) {
        const auth0Connection = appConfig.auth0Connection;
        const auth0ClientId = appConfig.auth0ClientId;
        const auth0Domain = appConfig.auth0Domain;
        const auth0Scope = appConfig.auth0Scope;

        const password = credentials.body.password;
        const email = credentials.body.email;
        const name = credentials.body.name;

        logger.info(`Authentication attempt for user ${name}`);

        axios.post(`https://${auth0Domain}/oauth/ro`, {
            username: name,
            password,
            connection: auth0Connection,
            client_id: auth0ClientId,
            scope: auth0Scope
        })
        .then(response => {
            const data = response.data;
            const status = response.status;

            if (status === 200) {
                return cb(null, {
                    token: data.id_token,
                    user: {
                        name,
                        email
                    }
                });
            }

            return cb(new Error('an error occurred', {status}));
        })
        .catch(err => {
            if (err.response && err.response.status === 401) {
                logger.info(`Authentication failed for user ${name}`);
                return cb(new Error('Invalid credentials'));
            }

            logger.error(`Authentication error for user ${name}`, err);
            return cb(err);
        });
    }
};
