'use strict';

const konfiga = require('konfiga');
const loadJsonFile = require('load-json-file');
const configPath = '/etc/npme/data/auth0.json';
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
        envVariableName: 'NODE_ENV',
        cmdLineArgName: 'auth0-connection',
        type: String
    },
    auth0ClientId: {
        defaultValue: getDefault('auth0ClientId'),
        envVariableName: 'NODE_ENV',
        cmdLineArgName: 'auth0-client-id',
        type: String
    },
    auth0Secret: {
        defaultValue: 'OAiT0rq749Lb2QKb5wpvslhJJiCTSAG1emggwXotE8MDXiB2x1GXEP-Shp_YQazp',
        envVariableName: 'NODE_ENV',
        cmdLineArgName: 'auth0-secret',
        type: String
    },
    auth0Domain: {
        defaultValue: getDefault('auth0Domain'),
        envVariableName: 'NODE_ENV',
        cmdLineArgName: 'auth0-domain',
        type: String
    },
    auth0Scope: {
        defaultValue: 'openid admin bucket',
        envVariableName: 'NODE_ENV',
        cmdLineArgName: 'auth0-scope',
        type: String
    },
    frontDoorHost: {
        defaultValue: getDefault('frontDoorHost'),
        envVariableName: 'NODE_ENV',
        cmdLineArgName: 'front-door-host',
        type: String
    },
    sharedFetchSecret: {
        defaultValue: getDefault('sharedFetchSecret'),
        envVariableName: 'NODE_ENV',
        cmdLineArgName: 'shared-fetch-secret',
        type: String
    }
});
