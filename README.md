# Rate-Limiter

A simple and reusable request rate-limiting microservice that protects external applications' endpoints.

## Features
- A light-weight microservice meaning it can be easily distributed and reused
- Rate-Limiter is stateless, clients can choose specific configurations for time-windows, request limits, etc.
- GRPC access to the API is provided, resulting in faster message transmissions and rigourous contracts
- User key value records are cached in Redis
