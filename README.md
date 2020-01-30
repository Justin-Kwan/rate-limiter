# Rate-Limiter

A simple and reusable request rate-limiting microservice that protects external applications' endpoints.

## Features
- A light-weight microservice which can be easily distributed and reused
- Rate-Limiter is stateless, clients can choose specific configurations for time-windows, request limits, etc.
- GRPC access to the API is provided, resulting in faster message transmissions and rigorous contracts
- User key value records are cached in Redis

## Running Locally

Make sure you have Node.js, npm and Redis installed

      # Clone this repo by typing into your terminal
      $ git clone https://github.com/Justin-Kwan/Rate-Limiter
      
      # Change to directory containing index.js file
      $ cd Rate-Limiter/server/src
      
      # start application
      $ node index.js
      
## Testing Locally
      
      # Change to server directory
      $ cd Rate-Limiter/server
      
      # Start Redis server 
      $ redis-server
      
      # run tests
      $ npm index.js
