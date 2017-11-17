'use strict';

const axios = require('axios');
const appConfig = require('./appConfig');
const logger = require('./logger');

exports.load = function load(path) {
    const frontDoorHost = appConfig.frontDoorHost;
    const sharedFetchSecret = appConfig.sharedFetchSecret;
    const instance = axios.create({
        baseURL: frontDoorHost
    });

    logger.debug(`packageJSONLoader.load from  ${path} with ${sharedFetchSecret}`);

    return instance.get(path, {
        params: {
            sharedFetchSecret
        }
    }).then(response => {
        const data = response.data;
        const status = response.status;

        logger.debug(`Received ${status} reponse for ${path}`);
        return data;
    });
};
