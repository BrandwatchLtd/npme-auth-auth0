'use strict';

const test = require('tape');
const nock = require('nock');
const sandboxedModule = require('sandboxed-module');

test('authenticating with good credentials', t => {
    const auth0Connection = 'Username-Password-Authentication';
    const auth0ClientId = 'fakeClientId';
    const auth0Domain = 'fake.eu.auth0.com';
    const auth0Scope = 'openid admin bucket';
    const name = 'Graham';
    const email = 'graham@brandwatch.com';
    const password = 'my-password';

    const Authenticator = sandboxedModule.require('../lib/Authenticator', {
        requires: {
            './appConfig': {
                auth0Connection,
                auth0ClientId,
                auth0Domain,
                auth0Scope
            }
        }
    });
    const credentials = {
        body: {
            name,
            email,
            password
        }
    };

    const instance = new Authenticator();

    t.plan(3);

    const scope = nock(`https://${auth0Domain}:443`, {encodedQueryParams: true})
        .post('/oauth/ro', {
            username: name,
            password,
            connection: auth0Connection,
            client_id: auth0ClientId,
            scope: auth0Scope
        })
        .reply(200, {
            id_token: 'FAKE_ID_TOKEN',
            access_token: 'FAKE_ACCESS_TOKEN',
            token_type: 'bearer'
        });

    instance.authenticate(credentials, (err, profile) => {
        t.equals(scope.isDone(), true, 'request was correctly formed');
        t.equals(err, null, 'there was no error returned');
        t.equals(profile.token, 'FAKE_ID_TOKEN', 'the id token from auth0 was returned');

        t.end();
    });
});

test('authenticating with bad credentials', t => {
    const auth0Connection = 'Username-Password-Authentication';
    const auth0ClientId = 'fakeClientId';
    const auth0Domain = 'brandwatch.eu.auth0.com';
    const auth0Scope = 'openid admin bucket';
    const name = 'Graham';
    const email = 'graham@brandwatch.com';
    const password = 'fake';

    const Authenticator = sandboxedModule.require('../lib/Authenticator', {
        requires: {
            './appConfig': {
                auth0Connection,
                auth0ClientId,
                auth0Domain,
                auth0Scope
            }
        }
    });
    const credentials = {
        body: {
            name,
            email,
            password
        }
    };

    const instance = new Authenticator();

    t.plan(3);

    const scope = nock(`https://${auth0Domain}:443`, {encodedQueryParams: true})
        .post('/oauth/ro', {
            username: name,
            password,
            connection: auth0Connection,
            client_id: auth0ClientId,
            scope: auth0Scope
        })
        .reply(401, {
            error: 'invalid_user_password',
            error_description: 'Wrong email or password.'
        });

    instance.authenticate(credentials, (err, token) => {
        t.equals(scope.isDone(), true, 'request was correctly formed');
        t.equals(err.message, 'Invalid credentials', 'the error message was as expected');
        t.equals(token, undefined, 'there was no token returned');

        t.end();
    });
});
