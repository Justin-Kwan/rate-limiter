const CacheAccessor = require('../../cache/CacheAccessor.js');
const User = require('../models/User.js');

class RateLimitHandler {

  constructor() {
    this.cacheAccessor = new CacheAccessor();
    this.NO_TOKENS = 0;
  }

  /**
   * @param {integer} - user's max # of tokens (request limit)
   * @param {tokenCount} - user's remaining tokens (request left)
   * @return {Object} - response object (containg rate limit info)
   */
  getResponseObj(maxTokens, tokenCount) {
    return {
      maxTokens: Number(maxTokens),
      tokenCount: Number(tokenCount)
    };
  }

  /**
   * @param {Object} - incoming request object (containing user reques info)
   * @return {Object} - response object (containg rate limit info)
   * @affects  - redis cache is modified with new user record inserted or old
   *             user record removed (by expirey)
   */
  async handleRateLimit(requestObj) {
    const user = new User.Builder()
      .withIpAddress(requestObj.ipAddress)
      .withRequestedRoute(requestObj.requestedRoute)
      .withRequestedServiceId(requestObj.requestedServiceId)
      .withMaxTokens(requestObj.maxTokens)
      .withRequestWindow(requestObj.requestWindow)
      .build();

    const doesUserExist = await this.cacheAccessor.doesUserExist(user);

    if (doesUserExist === false) {
      await this.cacheAccessor.insertNewUser(user);
    }

    const userTokenCount = await this.cacheAccessor.getTokenCount(user);

    if (userTokenCount <= 0) {
      return this.getResponseObj(user.getMaxTokens(), this.NO_TOKENS);
    }

    await this.cacheAccessor.subtractToken(user);
    const newTokenCount = await this.cacheAccessor.getTokenCount(user);
    return this.getResponseObj(user.getMaxTokens(), newTokenCount);
  }

}

module.exports = RateLimitHandler;
