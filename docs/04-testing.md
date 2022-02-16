# Automated tests

## Unit tests

### JS/TS
To test the smallest unit we use Jest.

* The tests for the `backend` can be found in the specific folders of every domain.

## Domain integration tests
The backend application contain intergration tests for testing fundamental `Resolvers` and `Services`. We do not mock any db methods or functionality, but we run all our tests against a real database which we clean after each test.

## API E2E tests
The Backend application includes E2E tests for all the endpoint. We follow the suggested E2E approach of Nest.js which can be found [here](https://docs.nestjs.com/fundamentals/testing#end-to-end-testing). E2E tests can be found in the specific domain in the `e2e` folders.
