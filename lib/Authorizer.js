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
            logger.debug('extracted token', JSON.stringify(token));
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

        const bucket = token.bucket;
        const admin = token.admin;
        const action = req.method === 'GET' ? 'read' : 'write';

        if (admin) {
            // admins can do anything;
            logger.info('user is admin, authorization success.');
            return cb(null, true);
        }

        logger.info(`user is not admin, fetching package.json from ${req.path}`);

        return packageJSONLoader.load(req.path.split('?')[0]).then(data => {
            const pkgjson = data;
            const scope = extractPackageScope(pkgjson);

            if (action === 'read') {
                logger.debug(`authorizing read for scope ${scope} and bucket ${bucket}`);
                return cb(null, authorizePackageRead(scope, bucket));
            }

            logger.debug(`authorizing write for scope ${scope} and bucket ${bucket}`);
            return cb(null, authorizePackageWrite(scope, bucket));
        })
        .catch(err => {
            logger.error('error loading package.json', err);
        });
    }

    // this handles `npm whoami` in the CLI
    whoami(req, cb) {
        const token = extractToken(req);

        if (!token) {
            return cb(new Error('Unauthorised'));
        }

        return cb(null, {
            email: token.email,
            name: token.username
        });
    }
};

function authorizePackageRead(scope, bucket) {
    const alwaysAllowedForReads = appConfig.alwaysAllowedForReads;

    if (!scope) {
        logger.info('authorizing read due to no scope being supplied');
        return true;
    }

    if (scope === bucket) {
        logger.info(`authorizing read due to scope ${scope} matching bucket ${bucket}`);
        return true;
    }

    if (alwaysAllowedForReads.indexOf(scope) > -1) {
        logger.info(`authorizing read due to scope ${scope} being a member of appConfig.alwaysAllowedForReads`);
        return true;
    }

    logger.info(`read not authorized for scope ${scope} and bucket ${bucket}`);
    return false;
}

function authorizePackageWrite(scope, bucket) {
    const alwaysAllowedForWrites = appConfig.alwaysAllowedForWrites;

    if (!scope || !bucket) {
        if (!scope) {
            logger.info('read not authorized due to no scope');
        }
        if (!bucket) {
            logger.info('read not authorized due to no bucket');
        }
        return false;
    }


    if (scope === bucket) {
        logger.info(`authorizing write due to scope ${scope} matching bucket ${bucket}`);
        return true;
    }

    if (alwaysAllowedForWrites.indexOf(scope) > -1) {
        logger.info(`authorizing write due to scope ${scope} being a member of appConfig.alwaysAllowedForWrites`);
        return true;
    }

    logger.info(`write not authorized for scope ${scope} and bucket ${bucket}`);
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
