# Rate-Limiter

A simple and reusable request rate-limiting microservice that protects external applications' endpoints.

## Features
- A light-weight microservice meaning it can be easily distributed and reused
- Stateless, clients can choose specific configurations for time-windows, request limits, etc.
- Provides GRPC access to it’s API, resulting in faster message transmissions and rigourous contracts
- User key value records are cached in Redis
