# Recreational Sports League Management Core Service
This repository contains the backend service built with Nestjs (Express and Typescript).

[API_Specification](https://recreation-sports-core-service-eja5ffe3fraeb5f8.eastus2-01.azurewebsites.net/api-spec)

## Overview
The main goal of the Recreational Sports League Management Core Service is to handle all data operations for creating, reading, updating, and deleting records. This service is responsible for CRUD operations on Users, Teams, Players, and Coaches.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Authentication Flow](#authentication-flow)
- [Endpoints](#endpoints)
- [Protect Endpoints](#protect-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Installation

1. Clone the repository:
   ```sh
   git clone git@github.com:congmul/recreational-sports-league-management-core-service.git
   cd household-accounts-core-service
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Set up environment variables:

    Create a .env file in the root directory and add the values (Please check env.example file)

4. Start the application:
    ```sh
    npm run start:dev
    ```

## Configuration
It needs to set env like the following examples.
```
MONGODB_URI=mongodb://localhost:27017
MONGO_DB_NAME=recreational-sports-league-mgmt
JWT_SECRET=your-secrect-value
```

## Usage
To run the app
```bash
npm run start:dev
```
This will start the application on 'http://localhost:3000'

## Authentication Flow
1. POST /auth/login
2. run LocalAuthGuard(in local-auth.guard.ts) middleware and validate func(in local.strategy) is triggered
3. if it is valid, user will be inserted in req.
4. Create Access token and return it.

## Endpoints
[API_Specification](https://recreation-sports-core-service-eja5ffe3fraeb5f8.eastus2-01.azurewebsites.net/api-spec)

## Protect Endpoints
It is using Passport JWT guard to protect endpoints. POST / PATCH / DELETE request will be check if it is valid request from admin or not.
Please check jwt.stragey.ts/jwt-auth-admin.guard file in auth folder.
1. It will extract JWT token from Header (Bearer token).
2. Check if it is expired or not. 
3. Check if the user has "admin" role or not. If not, 401.

## Project Structure
1. Module file
 - generally, one module is for one route
2. Controller file
 - handling incoming requests and returning responses 
3. Service file
 - Controllers should handle HTTP requests and delegate more complex tasks to Service(providers).

```bash
recreational-sports-league-management-core-service/
  ├── src/ 
  │ ├── auth/                       # /auth route
  │ │    ├── dto/                   # type of ReqBody
  │ │    ├── auth.controller.ts
  │ │    ├── auth.module.ts
  │ │    ├── auth.service.ts
  │ │    ├── local-auth.guard.ts
  │ │    └── local.strategy.ts
  │ ├── health/                     # /health route
  │ │    ├── health.controller.ts   
  │ │    └── health.module.ts
  │ ├── user/                       # /user route
  │ │    ├── dto/                  
  │ │    ├── user.controller.ts    
  │ │    ├── user.module.ts
  │ │    ├── user.enum.ts
  │ │    ├── user.schema.ts         # user model
  │ │    └── user.service.ts
  │ ├── app.module.ts               # Imports all modules
  │ ├── env.validation.ts
  │ └── main.ts                     # Entry point
  ├── .env
  └── package.json
```

## Contributing
1. Clone the repository.
2. Create a new branch: `git checkout -b feature/your-feautre-name` on `development` branch.
3. Whatever work you do, after it has been tested locally by hand and unit/integration tests, you will bump the major, minor, or patch versions of package.json file based on the scope of work completed. Rule of thumb is:
 - Breaking changes = bump major version
 - Additional feature(s) with no breaking changes = bump minor version
 - Chore or bug fix = bump patch version
4. Make your changes an commit them: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Open a pull request.