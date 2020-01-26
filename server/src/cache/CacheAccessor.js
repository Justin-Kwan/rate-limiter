const redis = require('redis');

class CacheAccessor {

  constructor() {
    this.PORT_NUMBER = 6379;
    this.THIRTY_SECONDS = 30;
    this.ZERO_REQUESTS = 0;
    this.cache = redis.createClient(this.PORT_NUMBER, '127.0.0.1');
  }

  /**
   * precondition: user (keys) must not exist in cache
   *
   * @param {User} - user object
   * @return {string} - JSON string of key value for cache (of a user)
   */
  getCacheKey(user) {
    return JSON.stringify({
      ip_address: user.getIpAddress(),
      requested_route: user.getRequestedRoute(),
      service_id: user.getRequestedServiceId(),
    });
  }

  /**
   * precondition: user (keys) must not exist in cache
   *
   * @param {User} - user object
   * @return {void}
   */
  insertNewUser(user) {
    const cacheKey = this.getCacheKey(user);

    let promise = new Promise((resolve, reject) => {
      this.cache.set(cacheKey, user.getMaxTokens());
      this.cache.expire(cacheKey, user.getRequestWindow());
      resolve();
    });

    return promise;
  }

  /**
   * precondition: user must exist in cache
   *
   * @param {User} - user object
   * @return {integer} - number of requests user has made
   */
  getTokenCount(user) {
    const cacheKey = this.getCacheKey(user);

    let promise = new Promise((resolve, reject) => {
      this.cache.get(cacheKey, (err, res) => {
        resolve(res);
      });
    });

    return promise;
  }

  /**
   * precondition: user must exist in cache
   *
   * @param {User} - user object
   * @return {void}
   */
  subtractToken(user) {
    const cacheKey = this.getCacheKey(user);

    let promise = new Promise((resolve, reject) => {
      this.cache.decr(cacheKey, (err, res) => {
        resolve();
      });
    });

    return promise;
  }

  /**
   * @param {User} - user object
   * @return {boolean} - represents if the user exists or not
   */
  doesUserExist(user) {
    const cacheKey = this.getCacheKey(user);

    let promise = new Promise((resolve, reject) => {
      this.cache.exists(cacheKey, (err, res) => {
        if (res === 1) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

    return promise;
  }

  /**
   * @param {void}
   * @return {void}
   */
  clear() {
    let promise = new Promise((resolve, reject) => {
      this.cache.flushdb(function(err, res) {
        resolve();
      });
    });
    return promise;
  }

}

module.exports = CacheAccessor;
