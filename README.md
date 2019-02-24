
# human-server-address

Get human readable server address

## Install

```
npm i human-server-address
```

## Usage

```js
const { createServer } = require('net')
const address = require('human-server-address')

const server = createServer()
server.listen()

console.log(address(server))
// => http://localhost
```
### API

```js
address(server, {
  protocol = 'http://',
  unspecified = 'localhost', // transform '0.0.0.0' and '::' to this
})
```
