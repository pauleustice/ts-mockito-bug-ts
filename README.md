# MockitoTest

> This repository was set up with Nx. Use `./node_modules/.bin/nx run mockito-test:test` to run the tests if you do not
> have Nx installed globally.

This is a test repository that highlights how ts-mockito is not compatible with Typescript 4.4.2 and above.

In its current form, this repo uses typescript version 4.4.2. You will see that tests fail for:

- A service contains an Observable that uses RxJS' `combineLatest()`
- The unit tests for that service uses ts-mockito's `spy()`
- Tests relating to that Observable fail with:
  - `actual.subscribe is not a function` (for Jasmine marbles tests)
  - `service.localCombinedObservable$.subscribe is not a function` (when subscribing in the spec)

Observables that do not use `combineLatest` (as seen in [the spec](apps/mockito-test/src/app/example.service.spec.ts))
do not have this issue.

Changing the `package.json > typescript` version to 4.3.5 (the last version before 4.4.2) will mean that all tests pass.
