'use strict';

const redis = require('redis');

module.exports = class Session {
    constructor(opts) {
        const redisPath = opts.redisPath || process.env.LOGIN_CACHE_REDIS;
        this.client = opts.client || redis.createClient(redisPath);
    }

    get(key, cb) {
        this.client.get(key, (err, data) => {
            if (err) {
                cb(err);
            } else {
                cb(undefined, JSON.parse(data));
            }
        });
    }

    set(key, session, cb) {
        this.client.set(key, JSON.stringify(session), cb);
    }

    delete(key, cb) {
        this.client.del(key, cb);
    }

    end() {
        this.client.quit();
    }
};
