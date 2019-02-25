# human-server-address

Get human readable server address

Converts `{address: '::', port: 80}` to `http://localhost`

Optionally provides internal, external, and public IP address

## Install

```
npm i human-server-address
```

## Usage

```js
const { createServer } = require('net')
const humanAddress = require('human-server-address')

const server = createServer()
server.listen()
const serverAddress = server.address()

const { local, internal, external, public, log } = humanAddress(serverAddress)

console.log(local)         // http://localhost
console.log(internal())    // http://127.0.0.1
console.log(external())    // http://192.168.1.2
public().then(console.log) // http://172.217.161.14

log`Please open one of the following URLs:
  Local:    ${local}
  Internal: ${internal}
  External: ${'external'}
  Public:   ${public}
`
```
### API

```js
const { local, internal, external, public, output, log } = humanAddress(server.address(), {
  protocol = 'http://',

  // Replace these addresses
  replace = ['0.0.0.0', '127.0.0.1', '::', '::1'],
  // with this string:
  localhost = 'localhost',

  // for getting Public address
  url = 'http://api.ipify.org', // API URL
  // url = 'http://icanhazip.com',
  // url = 'http://fugal.net/ip.cgi',
  timeout = 1000,

  useCache = true, // use cached results after fetching once
  halt = false, // halt on errors, or return "(unavailable)"
  silent = true, // log errors or not
})
```
```js
local // string
```
```js
internal() // function
```
```js
external() // function
```
```js
public().then(...) // async function
```
```js
output` ... ` // Tagged Template that expands `${local|internal|external|public}`
              // Returns a string, or a Promise if `public` was used
```
```js
log` ... ` // `console.log`s `output` (auto-awaits Promise if `public` was used)
```
