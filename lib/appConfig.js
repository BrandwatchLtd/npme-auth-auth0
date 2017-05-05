'use strict';

const konfiga = require('konfiga');
const npmeConfig = require('@npm/enterprise-configurator').Config(); // eslint-disable-line new-cap

function getNpmeConfig(key) {
    return npmeConfig[key] || '';
}

module.exports = konfiga({
    auth0Connection: {
        defaultValue: getNpmeConfig('auth0Connection'),
        envVariableName: 'NODE_ENV',
        cmdLineArgName: 'auth0-connection',
        type: String
    },
    auth0ClientId: {
        defaultValue: getNpmeConfig('auth0ClientId'),
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
        defaultValue: getNpmeConfig('auth0Domain'),
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
        defaultValue: getNpmeConfig('frontDoorHost'),
        envVariableName: 'NODE_ENV',
        cmdLineArgName: 'front-door-host',
        type: String
    },
    sharedFetchSecret: {
        defaultValue: getNpmeConfig('sharedFetchSecret'),
        envVariableName: 'NODE_ENV',
        cmdLineArgName: 'shared-fetch-secret',
        type: String
    }
});
