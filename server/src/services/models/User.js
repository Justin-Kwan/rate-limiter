
class User {

  constructor(build) {
    this.ipAddress = undefined;
    this.requestedRoute = undefined;
    this.requestedServiceId = undefined;
    this.maxTokens = undefined;
    this.requestWindow = undefined;

    this.setIpAddress(build.ipAddress);
    this.setRequestedRoute(build.requestedRoute);
    this.setRequestedServiceId(build.requestedServiceId);
    this.setMaxTokens(build.maxTokens);
    this.setRequestWindow(build.requestWindow);
  }

  static get Builder() {

    class Builder {

      withIpAddress(ipAddress) {
        this.ipAddress = ipAddress;
        return this;
      }

      withRequestedRoute(requestedRoute) {
        this.requestedRoute = requestedRoute;
        return this;
      }

      withRequestedServiceId(requestedServiceId) {
        this.requestedServiceId = requestedServiceId;
        return this;
      }

      withMaxTokens(maxTokens) {
        this.maxTokens = maxTokens;
        return this;
      }

      withRequestWindow(requestWindow) {
        this.requestWindow = requestWindow;
        return this;
      }

      build() {
        return new User(this);
      }
    }
    return Builder;

  }

  setIpAddress(ipAddress) {
    this.ipAddress = ipAddress;
  }

  setRequestedRoute(requestedRoute) {
    this.requestedRoute = requestedRoute;
  }

  setRequestedServiceId(requestedServiceId) {
    this.requestedServiceId = requestedServiceId;
  }

  setMaxTokens(maxTokens) {
    this.maxTokens = maxTokens;
  }

  setRequestWindow(requestWindow) {
    this.requestWindow = requestWindow;
  }

  getIpAddress() {
    return this.ipAddress;
  }

  getRequestedRoute() {
    return this.requestedRoute;
  }

  getRequestedServiceId() {
    return this.serviceId;
  }

  getMaxTokens() {
    return this.maxTokens;
  }

  getRequestWindow() {
    return this.requestWindow;
  }

}

module.exports = User;
