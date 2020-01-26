const expect = require('chai').expect;
const assert = require('assert');
const RateLimitHandler = require('../src/services/handlers/RateLimitHandler.js');
const User = require('../src/services/models/User.js');

let rateLimitHandler = new RateLimitHandler();

describe('RateLimitHandler Tests', function() {

  afterEach(function(done) {
    rateLimitHandler.cacheAccessor.clear();
    done();
  });

  it('handleRateLimit() test - insert new user', async function() {
    const requestObj = getRequestObj("133.421.123.12", "/endpoint", 111, 10, 10);
    const responseObj = await rateLimitHandler.handleRateLimit(requestObj);

    assert.deepEqual(responseObj, {
      maxTokens: 10,
      tokenCount: 9
    });

  });

  it('handleRateLimit() test - insert new user', async function() {
    const requestObj = getRequestObj("133.421.123.13", "/endpoint", 111, 1001, 10);
    const responseObj = await rateLimitHandler.handleRateLimit(requestObj);

    assert.deepEqual(responseObj, {
      maxTokens: 1001,
      tokenCount: 1000
    });

  });

  it('handleRateLimit() test - remove 2 user token', async function() {
    const requestObj = getRequestObj("133.421.123.13", "/endpoint", 111, 1001, 10);
    const responseObj = await rateLimitHandler.handleRateLimit(requestObj);
    const newResponseObj = await rateLimitHandler.handleRateLimit(requestObj);

    assert.deepEqual(newResponseObj, {
      maxTokens: 1001,
      tokenCount: 999
    });

  });

  it('handleRateLimit() test - remove 49 user token', async function() {
    const requestObj = getRequestObj("133.421.123.13", "/endpoint", 111, 50, 10);
    let responseObj = undefined;

    for(var i = 0; i < 49; i++) {
      responseObj = await rateLimitHandler.handleRateLimit(requestObj);
    }

    assert.deepEqual(responseObj, {
      maxTokens: 50,
      tokenCount: 1
    });

  });

  it('handleRateLimit() test - remove all 20 user token', async function() {
    const requestObj = getRequestObj("133.421.123.13", "/endpoint", 111, 20, 10);
    let responseObj = undefined;

    for(var i = 0; i < 20; i++) {
      responseObj = await rateLimitHandler.handleRateLimit(requestObj);
    }

    assert.deepEqual(responseObj, {
      maxTokens: 20,
      tokenCount: 0
    });

  });

  it('handleRateLimit() test - remove all 20 user token & continue requests', async function() {
    const requestObj = getRequestObj("133.421.123.13", "/endpoint", 111, 20, 10);
    let responseObj = undefined;

    for(var i = 0; i < 40; i++) {
      responseObj = await rateLimitHandler.handleRateLimit(requestObj);
    }

    assert.deepEqual(responseObj, {
      maxTokens: 20,
      tokenCount: 0
    });

  });
});

function getRequestObj(ipAddress, requestedRoute, requestedServiceId, maxTokens, requestWindow) {
  return {
    ipAddress: ipAddress,
    requestedRoute: requestedRoute,
    requestedServiceId: requestedServiceId,
    maxTokens: maxTokens,
    requestWindow: requestWindow
  };
}
