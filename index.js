const { URL } = require('url');
const utils = require('./utils');

module.exports = (address, {
  protocol = 'http://',
  localhost = 'localhost',
  replace = ['0.0.0.0', '127.0.0.1', '::', '::1'],
  url = 'http://api.ipify.org',
  // url = 'http://icanhazip.com',
  // url = 'http://fugal.net/ip.cgi',
  timeout = 1000,
  useCache = true,
  halt = false,
  silent = true,
} = {}) => {
  if (!address.address && address.port) throw new Error('Invalid server address object. Expected an `{address, port}`');

  const port = address.port === 80 ? '' : ':' + address.port;
  const host = (host) => new URL(protocol + host + port);

  const safe = halt ? f => f() : f => utils.catchFn(f, silent ? () => '(unavailable)' : '(unavailable)');

  const local = replace.includes(address.address) ? host(localhost) : host(address.address);
  const internal = safe(() => host(utils.getInternal(useCache)));
  const external = safe(() => host(utils.getExternal(useCache)));
  const public = safe(() => utils.getPublic(url, timeout, useCache).then(host));
  const output = utils.getOutput({ local, internal, external, public, });
  const log = (...args) => utils.asyncLogger(output(...args));

  return { local, internal, external, public, output, log };
};
