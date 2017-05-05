'use strict';

const test = require('tape');
const sinon = require('sinon');
const sandboxedModule = require('sandboxed-module');

test('can decode a valid jwt', t => {
    const jwt = 'foo';
    const fakeSecret = 'shhhh';
    const verifyStub = sinon.stub();

    const jwtHelper = sandboxedModule.require('../lib/jwtHelper', {
        requires: {
            jsonwebtoken: {
                verify: verifyStub
            },
            './appConfig': {
                auth0Secret: fakeSecret
            }
        }
    });

    jwtHelper.decode(jwt);

    t.equals(verifyStub.calledOnce, true, 'calls jwt.verify()');
    t.equals(verifyStub.args[0][0], jwt, 'calls jwt.verify() with the jwt');
    t.equals(verifyStub.args[0][1], fakeSecret, 'calls jwt.verify() with the auth0Secret from appConfig');

    t.end();
});
