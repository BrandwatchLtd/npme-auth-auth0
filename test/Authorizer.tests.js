/* eslint-disable max-lines */
'use strict';

const test = require('tape');
const sinon = require('sinon');
const sandboxedModule = require('sandboxed-module');

function fakeLogger() {
    return {
        debug: sinon.stub(),
        info: sinon.stub(),
        warn: sinon.stub(),
        error: sinon.stub()
    };
}

/* writing packages */
test('authorizes a package write for an admin with a package scope that matches their user bucket', t => {
    const fakeRes = {
        body: {
            name: '@fakeOrg/packageName'
        }
    };
    const decodeStub = sinon.stub().returns({
        admin: true,
        bucket: 'fakeOrg'
    });
    const loadStub = sinon.stub().returns(Promise.resolve(fakeRes));
    const Authorizer = sandboxedModule.require('../lib/Authorizer', {
        requires: {
            './appConfig': {

            },
            './jwtHelper': {
                decode: decodeStub
            },
            './packageJSONLoader': {
                load: loadStub
            },
            './logger': fakeLogger()
        }
    });
    const instance = new Authorizer();
    const req = {
        headers: {
            authorization: 'Bearer FAKE_TOKEN'
        },
        path: '/path?foo=bar',
        method: 'write'
    };

    instance.authorize(req, (err, res) => {
        t.equals(decodeStub.calledOnce, true, 'called jwtHelper.decode');
        t.equals(decodeStub.args[0][0], 'FAKE_TOKEN', 'extracted the encoded token from the auth header');

        t.equals(err, null, 'it did not error');
        t.equals(res, true, 'it authorized');

        t.end();
    });
});
test('authorizes a package write for an admin with a package scope that does not match the user bucket', t => {
    const fakeRes = {
        body: {
            name: '@fakeOrg/packageName'
        }
    };
    const decodeStub = sinon.stub().returns({
        admin: true,
        bucket: 'aDifferentOrg'
    });
    const loadStub = sinon.stub().returns(Promise.resolve(fakeRes));
    const Authorizer = sandboxedModule.require('../lib/Authorizer', {
        requires: {
            './appConfig': {

            },
            './jwtHelper': {
                decode: decodeStub
            },
            './packageJSONLoader': {
                load: loadStub
            },
            './logger': fakeLogger()
        }
    });
    const instance = new Authorizer();
    const req = {
        headers: {
            authorization: 'Bearer FAKE_TOKEN'
        },
        path: '/path?foo=bar',
        method: 'write'
    };

    instance.authorize(req, (err, res) => {
        t.equals(decodeStub.calledOnce, true, 'called jwtHelper.decode');
        t.equals(decodeStub.args[0][0], 'FAKE_TOKEN', 'extracted the encoded token from the auth header');

        t.equals(err, null, 'it did not error');
        t.equals(res, true, 'it authorized');

        t.end();
    });
});
test('authorizes a package write for a non-admin with a package scope that matches their user bucket', t => {
    const fakeRes = {
        body: {
            name: '@fakeOrg/packageName'
        }
    };
    const decodeStub = sinon.stub().returns({
        admin: false,
        bucket: 'fakeOrg'
    });
    const loadStub = sinon.stub().returns(Promise.resolve(fakeRes));
    const Authorizer = sandboxedModule.require('../lib/Authorizer', {
        requires: {
            './appConfig': {

            },
            './jwtHelper': {
                decode: decodeStub
            },
            './packageJSONLoader': {
                load: loadStub
            },
            './logger': fakeLogger()
        }
    });
    const instance = new Authorizer();
    const req = {
        headers: {
            authorization: 'Bearer FAKE_TOKEN'
        },
        path: '/path?foo=bar',
        method: 'write'
    };

    instance.authorize(req, (err, res) => {
        t.equals(decodeStub.calledOnce, true, 'called jwtHelper.decode');
        t.equals(decodeStub.args[0][0], 'FAKE_TOKEN', 'extracted the encoded token from the auth header');

        t.equals(err, null, 'it did not error');
        t.equals(res, true, 'it authorized');

        t.end();
    });
});
test('does not authorize a package write for a non-admin with a package scope that does not match the user bucket', t => {
    const fakeRes = {
        body: {
            name: '@fakeOrg/packageName'
        }
    };
    const decodeStub = sinon.stub().returns({
        admin: false,
        bucket: 'differentOrg'
    });
    const loadStub = sinon.stub().returns(Promise.resolve(fakeRes));
    const Authorizer = sandboxedModule.require('../lib/Authorizer', {
        requires: {
            './appConfig': {
                alwaysAllowedForWrites: []
            },
            './jwtHelper': {
                decode: decodeStub
            },
            './packageJSONLoader': {
                load: loadStub
            },
            './logger': fakeLogger()
        }
    });
    const instance = new Authorizer();
    const req = {
        headers: {
            authorization: 'Bearer FAKE_TOKEN'
        },
        path: '/path?foo=bar',
        method: 'write'
    };

    instance.authorize(req, (err, res) => {
        t.equals(decodeStub.calledOnce, true, 'called jwtHelper.decode');
        t.equals(decodeStub.args[0][0], 'FAKE_TOKEN', 'extracted the encoded token from the auth header');

        t.equals(err, null, 'it did not error');
        t.equals(res, false, 'it denied authorization');

        t.end();
    });
});
test('authorizes a package write for a non-admin with a package scope that matches `appConfig.alwaysAllowedForWrites`', t => {
    const fakeRes = {
        body: {
            name: '@fakeOrg/packageName'
        }
    };
    const decodeStub = sinon.stub().returns({
        admin: false,
        bucket: 'personal-bucket'
    });
    const loadStub = sinon.stub().returns(Promise.resolve(fakeRes));
    const Authorizer = sandboxedModule.require('../lib/Authorizer', {
        requires: {
            './appConfig': {
                alwaysAllowedForWrites: ['fakeOrg']
            },
            './jwtHelper': {
                decode: decodeStub
            },
            './packageJSONLoader': {
                load: loadStub
            },
            './logger': fakeLogger()
        }
    });
    const instance = new Authorizer();
    const req = {
        headers: {
            authorization: 'Bearer FAKE_TOKEN'
        },
        path: '/path?foo=bar',
        method: 'write'
    };

    instance.authorize(req, (err, res) => {
        t.equals(decodeStub.calledOnce, true, 'called jwtHelper.decode');
        t.equals(decodeStub.args[0][0], 'FAKE_TOKEN', 'extracted the encoded token from the auth header');

        t.equals(err, null, 'it did not error');
        t.equals(res, true, 'it authorized');

        t.end();
    });
});

/* reading packages */
test('authorizes a package read for an admin with a package scope that matches their user bucket', t => {
    const fakeRes = {
        body: {
            name: '@fakeOrg/packageName'
        }
    };
    const decodeStub = sinon.stub().returns({
        admin: true,
        bucket: 'fakeOrg'
    });
    const loadStub = sinon.stub().returns(Promise.resolve(fakeRes));
    const Authorizer = sandboxedModule.require('../lib/Authorizer', {
        requires: {
            './appConfig': {

            },
            './jwtHelper': {
                decode: decodeStub
            },
            './packageJSONLoader': {
                load: loadStub
            },
            './logger': fakeLogger()
        }
    });
    const instance = new Authorizer();
    const req = {
        headers: {
            authorization: 'Bearer FAKE_TOKEN'
        },
        path: '/path?foo=bar',
        method: 'GET'
    };

    instance.authorize(req, (err, res) => {
        t.equals(decodeStub.calledOnce, true, 'called jwtHelper.decode');
        t.equals(decodeStub.args[0][0], 'FAKE_TOKEN', 'extracted the encoded token from the auth header');

        t.equals(err, null, 'it did not error');
        t.equals(res, true, 'it authorized');

        t.end();
    });
});
test('authorizes a package read for an admin with a package scope that does not match the user bucket', t => {
    const fakeRes = {
        body: {
            name: '@fakeOrg/packageName'
        }
    };
    const decodeStub = sinon.stub().returns({
        admin: true,
        bucket: 'adminOrg'
    });
    const loadStub = sinon.stub().returns(Promise.resolve(fakeRes));
    const Authorizer = sandboxedModule.require('../lib/Authorizer', {
        requires: {
            './appConfig': {

            },
            './jwtHelper': {
                decode: decodeStub
            },
            './packageJSONLoader': {
                load: loadStub
            },
            './logger': fakeLogger()
        }
    });
    const instance = new Authorizer();
    const req = {
        headers: {
            authorization: 'Bearer FAKE_TOKEN'
        },
        path: '/path?foo=bar',
        method: 'GET'
    };

    instance.authorize(req, (err, res) => {
        t.equals(decodeStub.calledOnce, true, 'called jwtHelper.decode');
        t.equals(decodeStub.args[0][0], 'FAKE_TOKEN', 'extracted the encoded token from the auth header');

        t.equals(err, null, 'it did not error');
        t.equals(res, true, 'it authorized');

        t.end();
    });
});
test('authorizes a package read for an admin with no package scope', t => {
    const fakeRes = {
        body: {
            name: 'packageName'
        }
    };
    const decodeStub = sinon.stub().returns({
        admin: true,
        bucket: 'fakeOrg'
    });
    const loadStub = sinon.stub().returns(Promise.resolve(fakeRes));
    const Authorizer = sandboxedModule.require('../lib/Authorizer', {
        requires: {
            './appConfig': {

            },
            './jwtHelper': {
                decode: decodeStub
            },
            './packageJSONLoader': {
                load: loadStub
            },
            './logger': fakeLogger()
        }
    });
    const instance = new Authorizer();
    const req = {
        headers: {
            authorization: 'Bearer FAKE_TOKEN'
        },
        path: '/path?foo=bar',
        method: 'GET'
    };

    instance.authorize(req, (err, res) => {
        t.equals(decodeStub.calledOnce, true, 'called jwtHelper.decode');
        t.equals(decodeStub.args[0][0], 'FAKE_TOKEN', 'extracted the encoded token from the auth header');

        t.equals(err, null, 'it did not error');
        t.equals(res, true, 'it authorized');

        t.end();
    });
});
test('authorizes a package read for a non-admin with a package scope that matches their user bucket', t => {
    const fakeRes = {
        body: {
            name: '@fakeOrg/packageName'
        }
    };
    const decodeStub = sinon.stub().returns({
        admin: false,
        bucket: 'fakeOrg'
    });
    const loadStub = sinon.stub().returns(Promise.resolve(fakeRes));
    const Authorizer = sandboxedModule.require('../lib/Authorizer', {
        requires: {
            './appConfig': {

            },
            './jwtHelper': {
                decode: decodeStub
            },
            './packageJSONLoader': {
                load: loadStub
            },
            './logger': fakeLogger()
        }
    });
    const instance = new Authorizer();
    const req = {
        headers: {
            authorization: 'Bearer FAKE_TOKEN'
        },
        path: '/path?foo=bar',
        method: 'GET'
    };

    instance.authorize(req, (err, res) => {
        t.equals(decodeStub.calledOnce, true, 'called jwtHelper.decode');
        t.equals(decodeStub.args[0][0], 'FAKE_TOKEN', 'extracted the encoded token from the auth header');

        t.equals(err, null, 'it did not error');
        t.equals(res, true, 'it authorized');

        t.end();
    });
});
test('does not authorize a package read for a non-admin with a package scope that does not match the user bucket', t => {
    const fakeRes = {
        body: {
            name: '@fakeOrg/packageName'
        }
    };
    const decodeStub = sinon.stub().returns({
        admin: false,
        bucket: 'differentOrg'
    });
    const loadStub = sinon.stub().returns(Promise.resolve(fakeRes));
    const Authorizer = sandboxedModule.require('../lib/Authorizer', {
        requires: {
            './appConfig': {
                alwaysAllowedForReads: []
            },
            './jwtHelper': {
                decode: decodeStub
            },
            './packageJSONLoader': {
                load: loadStub
            },
            './logger': fakeLogger()
        }
    });
    const instance = new Authorizer();
    const req = {
        headers: {
            authorization: 'Bearer FAKE_TOKEN'
        },
        path: '/path?foo=bar',
        method: 'GET'
    };

    instance.authorize(req, (err, res) => {
        t.equals(decodeStub.calledOnce, true, 'called jwtHelper.decode');
        t.equals(decodeStub.args[0][0], 'FAKE_TOKEN', 'extracted the encoded token from the auth header');

        t.equals(err, null, 'it did not error');
        t.equals(res, false, 'it denied authorization');

        t.end();
    });
});
test('authorizes a package read for a non-admin with no package scope', t => {
    const fakeRes = {
        body: {
            name: 'packageName'
        }
    };
    const decodeStub = sinon.stub().returns({
        admin: false,
        bucket: 'fakeOrg'
    });
    const loadStub = sinon.stub().returns(Promise.resolve(fakeRes));
    const Authorizer = sandboxedModule.require('../lib/Authorizer', {
        requires: {
            './appConfig': {

            },
            './jwtHelper': {
                decode: decodeStub
            },
            './packageJSONLoader': {
                load: loadStub
            },
            './logger': fakeLogger()
        }
    });
    const instance = new Authorizer();
    const req = {
        headers: {
            authorization: 'Bearer FAKE_TOKEN'
        },
        path: '/path?foo=bar',
        method: 'GET'
    };

    instance.authorize(req, (err, res) => {
        t.equals(decodeStub.calledOnce, true, 'called jwtHelper.decode');
        t.equals(decodeStub.args[0][0], 'FAKE_TOKEN', 'extracted the encoded token from the auth header');

        t.equals(err, null, 'it did not error');
        t.equals(res, true, 'it authorized');

        t.end();
    });
});
test('authorizes a package read for a non-admin with a package scope that matches `appConfig.alwaysAllowedForWrites`', t => {
    const fakeRes = {
        body: {
            name: '@fakeOrg/packageName'
        }
    };
    const decodeStub = sinon.stub().returns({
        admin: false,
        bucket: 'personal-bucket'
    });
    const loadStub = sinon.stub().returns(Promise.resolve(fakeRes));
    const Authorizer = sandboxedModule.require('../lib/Authorizer', {
        requires: {
            './appConfig': {
                alwaysAllowedForReads: ['fakeOrg']
            },
            './jwtHelper': {
                decode: decodeStub
            },
            './packageJSONLoader': {
                load: loadStub
            },
            './logger': fakeLogger()
        }
    });
    const instance = new Authorizer();
    const req = {
        headers: {
            authorization: 'Bearer FAKE_TOKEN'
        },
        path: '/path?foo=bar',
        method: 'GET'
    };

    instance.authorize(req, (err, res) => {
        t.equals(decodeStub.calledOnce, true, 'called jwtHelper.decode');
        t.equals(decodeStub.args[0][0], 'FAKE_TOKEN', 'extracted the encoded token from the auth header');

        t.equals(err, null, 'it did not error');
        t.equals(res, true, 'it authorized');

        t.end();
    });
});
