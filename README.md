# Rate-Limiter

A simple and reusable request rate-limiting microservice that protects external applications' endpoints.

## Features
- A light-weight microservice which can be easily distributed and reused
- Rate-Limiter is stateless, clients can choose specific configurations for time-windows, request limits, etc.
- GRPC access to the API is provided, resulting in faster message transmissions and rigorous contracts
- User key value records are cached in Redis

## Running Locally

Clone this repo by typing into your terminal

      git clone https://github.com/Justin-Kwan/Rate-Limiter
   
Make sure you have Node.js and Redis installed

