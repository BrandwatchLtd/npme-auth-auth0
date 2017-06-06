'use strict';

const konfiga = require('konfiga');
const loadJsonFile = require('load-json-file');
const configPath = '/usr/local/lib/npme/data/auth0.json';
let defaults;

try {
    defaults = loadJsonFile.sync(configPath);
} catch (e) {
    console.error(`could not load config defaults from ${configPath}`); //eslint-disable-line no-console
}

function getDefault(key) {
    return defaults && defaults[key] || '';
}

module.exports = konfiga({
    auth0Connection: {
        defaultValue: getDefault('auth0Connection'),
        envVariableName: 'AUTH0_CONNECTION',
        cmdLineArgName: 'auth0-connection',
        type: String
    },
    auth0ClientId: {
        defaultValue: getDefault('auth0ClientId'),
        envVariableName: 'AUTH0_CLIENT_ID',
        cmdLineArgName: 'auth0-client-id',
        type: String
    },
    auth0Secret: {
        defaultValue: getDefault('auth0Secret'),
        envVariableName: 'AUTH0_SECRET',
        cmdLineArgName: 'auth0-secret',
        type: String
    },
    auth0Domain: {
        defaultValue: getDefault('auth0Domain'),
        envVariableName: 'AUTH0_DOMAIN',
        cmdLineArgName: 'auth0-domain',
        type: String
    },
    auth0Scope: {
        defaultValue: 'openid admin bucket',
        envVariableName: 'AUTH0_SCOPE',
        cmdLineArgName: 'auth0-scope',
        type: String
    },
    frontDoorHost: {
        defaultValue: getDefault('frontDoorHost'),
        envVariableName: 'FRONT_DOOR_HOST',
        cmdLineArgName: 'front-door-host',
        type: String
    },
    sharedFetchSecret: {
        defaultValue: getDefault('sharedFetchSecret'),
        envVariableName: 'SHARED_FETCH_SECRET',
        cmdLineArgName: 'shared-fetch-secret',
        type: String
    }
});
