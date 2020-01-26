const expect = require('chai').expect;
const assert = require('assert');
const CacheAccessor = require('../src/cache/CacheAccessor.js');
const User = require('../src/services/models/User.js');

let cacheAccessor = new CacheAccessor();

describe('CacheAccessor Tests', function() {

  afterEach(function(done) {
    cacheAccessor.clear();
    done();
  });

  it('insertNewUser() test - should insert a new user', async function() {
    const user = new User.Builder()
      .withIpAddress("fake_ip")
      .withRequestedRoute("/fakeRoute")
      .withRequestedServiceId(111)
      .withMaxTokens(20)
      .withRequestWindow(30)
      .build();

    cacheAccessor.insertNewUser(user);
    const tokenCount = await cacheAccessor.getTokenCount(user);
    assert.equal(tokenCount, 20);
  });

  it('insertNewUser() test - should insert a new user', async function() {
    const user = new User.Builder()
      .withIpAddress("fake_ip")
      .withRequestedRoute("/fakeRoute")
      .withRequestedServiceId(111)
      .withMaxTokens(10)
      .withRequestWindow(30)
      .build();

    cacheAccessor.insertNewUser(user);
    const tokenCount = await cacheAccessor.getTokenCount(user);
    assert.equal(tokenCount, 10);
  });

  it('subtractToken() test - should subtract a user tokens to 14', async function() {
    const user = new User.Builder()
      .withIpAddress("fake_ip")
      .withRequestedRoute("/fakeRoute")
      .withRequestedServiceId(111)
      .withMaxTokens(15)
      .withRequestWindow(30)
      .build();

    cacheAccessor.insertNewUser(user);
    cacheAccessor.subtractToken(user);
    const tokenCount = await cacheAccessor.getTokenCount(user);
    assert.equal(tokenCount, 14);
  });

  it('subtractToken() test - should subtract user tokens to 4', async function() {
    const user = new User.Builder()
      .withIpAddress("fake_ip")
      .withRequestedRoute("/fakeRoute")
      .withRequestedServiceId(111)
      .withMaxTokens(15)
      .withRequestWindow(30)
      .build();

    cacheAccessor.insertNewUser(user);

    for (let i = 0; i < 11; ++i) {
      cacheAccessor.subtractToken(user);
    }

    const tokenCount = await cacheAccessor.getTokenCount(user);
    assert.equal(tokenCount, 4);
  });

  it('getTokenCount() test - should get user token count of 218', async function() {
    const user = new User.Builder()
      .withIpAddress("fake_ip")
      .withRequestedRoute("/fakeRoute")
      .withRequestedServiceId(111)
      .withMaxTokens(219)
      .withRequestWindow(20)
      .build();

    cacheAccessor.insertNewUser(user);
    cacheAccessor.subtractToken(user);
    const tokenCount = await cacheAccessor.getTokenCount(user);
    assert.equal(tokenCount, 218);
  });

  it('getTokenCount() test - should get user token count of 4902', async function() {
    const user = new User.Builder()
      .withIpAddress("fake_ip")
      .withRequestedRoute("/fakeRoute")
      .withRequestedServiceId(111)
      .withMaxTokens(5102)
      .withRequestWindow(20)
      .build();

    cacheAccessor.insertNewUser(user);

    for (let i = 0; i < 200; ++i) {
      cacheAccessor.subtractToken(user);
    }

    const tokenCount = await cacheAccessor.getTokenCount(user);
    assert.equal(tokenCount, 4902);
  });

  it('doesUserExist() test - should return true', async function() {
    const user = new User.Builder()
      .withIpAddress("fake_ip")
      .withRequestedRoute("/fakeRoute")
      .withRequestedServiceId(111)
      .withMaxTokens(5102)
      .withRequestWindow(20)
      .build();

    cacheAccessor.insertNewUser(user);
    const doesUserExist = await cacheAccessor.doesUserExist(user);
    assert.equal(doesUserExist, true);
  });

  it('doesUserExist() test - should return true', async function() {
    const user = new User.Builder()
      .withIpAddress("fake_ip")
      .withRequestedRoute("/fakeRoute")
      .withRequestedServiceId(111)
      .withMaxTokens(5102)
      .withRequestWindow(20)
      .build();

    cacheAccessor.insertNewUser(user);
    const doesUserExist = await cacheAccessor.doesUserExist(user);
    assert.equal(doesUserExist, true);
  });

  it('doesUserExist() test - should return false', async function() {
    const user = new User.Builder()
      .withIpAddress("fake_ip")
      .withRequestedRoute("/fakeRoute")
      .withRequestedServiceId(111)
      .withMaxTokens(5102)
      .withRequestWindow(20)
      .build();

    const doesUserExist = await cacheAccessor.doesUserExist(user);
    assert.equal(doesUserExist, false);
  });

  it('doesUserExist() test - should return false from record expirery', async function() {
    const user = new User.Builder()
      .withIpAddress("fake_ip")
      .withRequestedRoute("/fakeRoute")
      .withRequestedServiceId(111)
      .withMaxTokens(5102)
      .withRequestWindow(1)
      .build();

    await cacheAccessor.insertNewUser(user);
    let doesUserExist = await cacheAccessor.doesUserExist(user);
    assert.equal(doesUserExist, true);

    await sleep(1000);  // 1 second for the cache record to expire

    doesUserExist = await cacheAccessor.doesUserExist(user);
    assert.equal(doesUserExist, false);
  });

});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
