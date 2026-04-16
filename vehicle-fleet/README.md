# Vehicle fleet

Implementation of the backend / DDD / CQRS exercise.

## Run the tests

```bash
npm install
npm test
```

## Run the CLI

Start PostgreSQL locally, create the database, and initialize the schema:

```bash
createdb -h localhost vehicle_fleet
psql -h localhost -U <your_user> vehicle_fleet -f sql/init.sql
```

Replace <your_user> with your local PostgreSQL user.


Then run the CLI with a PostgreSQL connection string:

```bash
DATABASE_URL=postgres://<your_user>@localhost:5432/vehicle_fleet npm run cli -- create user-1
DATABASE_URL=postgres://<your_user>@localhost:5432/vehicle_fleet npm run cli -- register-vehicle <fleetId> AA-123-BB
DATABASE_URL=postgres://<your_user>@localhost:5432/vehicle_fleet npm run cli -- localize-vehicle <fleetId> AA-123-BB 48.8566 2.3522
```

AA-123-BB is an example vehicle plate number.
48.8566 2.3522 are example GPS coordinates.

## Project structure

```text
src/
  App/
  Domain/
  Infra/
```

## Notes

I kept the implementation deliberately simple:

- `Domain` contains the business rules
- `App` contains the main use cases
- `Infra` contains the in-memory and PostgreSQL repositories
- Cucumber scenarios are connected to the application layer
- step 1 uses an in-memory repository
- step 2 uses PostgreSQL through a simple SQL repository

The goal was to stay close to the requested architecture while avoiding unnecessary complexity.

## Code quality

A few tools that would make sense here:

- **ESLint**: to keep the codebase consistent and catch common issues
- **Prettier**: to enforce a simple and predictable formatting
- **TypeScript strict mode**: to keep the domain and application layers safer
- **Cucumber**: to validate the expected business behavior

## CI / CD

A simple CI pipeline could:

1. install dependencies
2. run TypeScript checks
3. run the Cucumber test suite
4. optionally run integration tests against PostgreSQL

For CD, the next step would depend on the target environment, but for this exercise a basic CI pipeline is enough.
