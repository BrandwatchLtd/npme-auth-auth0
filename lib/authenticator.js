'use strict';

const axios = require('axios');
const appConfig = require('./appConfig');

module.exports = class Authenticator {
    authenticate(credentials, cb) {
        const auth0Connection = appConfig.auth0Connection;
        const auth0ClientId = appConfig.auth0ClientId;
        const auth0Domain = appConfig.auth0Domain;
        const auth0Scope = appConfig.auth0Scope;

        const {password, email, name} = credentials.body;

        axios.post(`https://${auth0Domain}/oauth/ro`, {
            username: email,
            password,
            connection: auth0Connection,
            client_id: auth0ClientId,
            scope: auth0Scope
        })
        .then(response => {
            const {data, status} = response;

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
                return cb(new Error('Invalid credentials'));
            }

            return cb(err);
        });
    }
};
