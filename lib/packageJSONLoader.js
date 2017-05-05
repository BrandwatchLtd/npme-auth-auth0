'use strict';

const axios = require('axios');
const appConfig = require('./appConfig');

exports.load = function load(path) {
    const frontDoorHost = appConfig.frontDoorHost;
    const sharedFetchSecret = appConfig.sharedFetchSecret;
    const instance = axios.create({
        baseURL: frontDoorHost
    });

    return instance.get(path, {
        params: {
            sharedFetchSecret
        }
    });
};
