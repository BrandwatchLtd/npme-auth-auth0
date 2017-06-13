'use strict';

const redis = require('redis');
const logger = require('./logger');

module.exports = class Session {
    constructor(opts) {
        const redisPath = opts.redisPath || process.env.LOGIN_CACHE_REDIS;
        this.client = opts.client || redis.createClient(redisPath);

        logger.info('Session initialised with redis client');
    }

    get(key, cb) {
        logger.debug(`session.get ${key}`);
        this.client.get(key, (err, data) => {
            if (err) {
                logger.error(`session.get ${key}`, err);
                cb(err);
            } else {
                logger.debug(`session.get retrieved ${key}`, JSON.parse(data));
                cb(undefined, JSON.parse(data));
            }
        });
    }

    set(key, session, cb) {
        logger.debug(`session.set ${key}`, JSON.stringify(session));
        this.client.set(key, JSON.stringify(session), cb);
    }

    delete(key, cb) {
        logger.debug(`session.del ${key}`);
        this.client.del(key, cb);
    }

    end() {
        this.client.quit();
    }
};
