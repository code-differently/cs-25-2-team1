/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

declare global {
  var jest: typeof import('jest');
  var describe: jest.Describe;
  var it: jest.It;
  var test: jest.It;
  var expect: jest.Expect;
  var beforeAll: jest.Lifecycle;
  var beforeEach: jest.Lifecycle;
  var afterAll: jest.Lifecycle;
  var afterEach: jest.Lifecycle;
}

export { };
