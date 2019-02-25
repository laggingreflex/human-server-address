const assert = require('assert');
const address = require('.');

console.log('Running tests... if no error outputs, all tests ran correctly.');
const error = error => {
  console.error(error);
  process.exitCode = 1;
};

assert.equal(address({
  address: '0.0.0.0',
  port: 80,
}).local, 'http://localhost');

assert.equal(address({
  address: '0.0.0.0',
  port: 80,
}, {
  localhost: 'example.com'
}).local, 'http://example.com');

assert.equal(address({
  address: '0.0.0.0',
  port: 80,
}).internal(), 'http://127.0.0.1');

assert(address({
  address: '0.0.0.0',
  port: 80,
}).internal().startsWith('http'));

assert.doesNotReject(() => address({
  address: '0.0.0.0',
  port: 80,
}).public().then((address) => {
  assert(address.startsWith('http'));
})).catch(error);
