'use strict';

const jwtHelper = require('./jwtHelper');
const packageJSONLoader = require('./packageJSONLoader');
const appConfig = require('./appConfig');
const logger = require('./logger');

module.exports = class Authorizer {
    authorize(req, cb) {
        let token;

        try {
            token = extractToken(req);
            logger.debug('extracted token', token);
        } catch (e) {
            logger.error('error extracting token', {
                token,
                error: e
            });
            return cb(new Error('Invalid token'));
        }

        if (!token) {
            return cb(new Error('Invalid token'));
        }

        const bucket = token.app_metadata.bucket;
        const admin = token.app_metadata.admin;
        const action = req.method === 'GET' ? 'read' : 'write';

        if (admin) {
            // admins can do anything;
            return cb(null, true);
        }

        return packageJSONLoader.load(req.path.split('?')[0]).then(res => {
            const pkgjson = res.body;
            const scope = extractPackageScope(pkgjson);

            if (action === 'read') {
                return cb(null, authorizePackageRead(scope, bucket));
            }

            return cb(null, authorizePackageWrite(scope, bucket));
        });
    }

    whoami(req, cb) {
        const token = extractToken(req);

        if (!token) {
            return cb(new Error('Unauthorised'));
        }

        return cb(null, {
            email: token.email,
            name: token.nickname
        });
    }
};

function authorizePackageRead(scope, bucket) {
    const alwaysAllowedForReads = appConfig.alwaysAllowedForReads;

    if (!scope) {
        return true;
    }

    if (scope === bucket) {
        return true;
    }

    if (alwaysAllowedForReads.indexOf(scope) > -1) {
        return true;
    }

    return false;
}

function authorizePackageWrite(scope, bucket) {
    const alwaysAllowedForWrites = appConfig.alwaysAllowedForWrites;

    if (!scope || !bucket) {
        return false;
    }

    if (scope === bucket) {
        return true;
    }

    if (alwaysAllowedForWrites.indexOf(scope) > -1) {
        return true;
    }

    return false;
}


function extractToken(req) {
    if (req && req.headers && req.headers.authorization && req.headers.authorization.match(/Bearer /)) {
        const token = req.headers.authorization.replace('Bearer ', '');
        return jwtHelper.decode(token);
    }
}

function extractPackageScope(pkgjson) {
    const name = pkgjson.name;

    if (!name.startsWith('@')) {
        return null;
    }

    return name.split('/')[0].slice(1);
}
