const grpc = require('grpc');
const RateLimitHandler = require('./services/handlers/RateLimitHandler.js');
const rateLimiterProto = grpc.load('./proto/rate_limiter.proto');

const rateLimitHander = new RateLimitHandler();


async function rateUserLimit(call, callback) {

  const requestObj = {
    ipAddress: call.request.ipAddress,
    requestedRoute: call.request.requestedRoute,
    requestedServiceId: call.request.requestedServiceId,
    maxTokens: call.request.maxTokens,
    requestWindow: call.request.requestWindow
  }

  const responseObj = await rateLimitHander.handleRateLimit(requestObj);
  callback(null, responseObj);
}

function main() {
  const server = new grpc.Server();

  server.addService(rateLimiterProto.RateLimiter.service, {
    rateUserLimit: rateUserLimit
  });

  server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());
  server.start();
  console.log('Server running at http://127.0.0.1:50051');
}

main();
