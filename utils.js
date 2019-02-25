const os = require('os');
const http = require('http');

const cached = {};
const cache = (key, getter, useCache = true) => useCache && cached[key] || (cached[key] = getter());

module.exports = { getInternal, getExternal, getPublic, getOutput, asyncLogger, catchFn };

function getOutput(ref) {
  return (strings, ...keys) => {
    const ret = [];
    let isPromise;
    for (let i = 0; i < Math.max(strings.length, keys.length); i++) {
      const string = strings[i] || '';
      let key = keys[i] || '';
      if (key in ref) key = ref[key];
      if (typeof key === 'function') key = key();
      if (key && key.then) isPromise = true;
      ret.push(string, key);
    }
    if (isPromise) return Promise.all(ret).then(ret => ret.join(''));
    else return ret.join('');
  }
}

async function asyncLogger(string) {
  try {
    if (string && string.then) string = await string;
    console.log(string);
  } catch (error) {
    console.error(error);
  }
}

function getInternal(useCache = true) {
  return cache('internal', () => getAllIPs().find(({ family, internal }) => family === 'IPv4' && internal).address, useCache);
}

function getExternal(useCache = true) {
  return cache('external', () => getAllIPs().find(({ family, internal }) => family === 'IPv4' && !internal).address, useCache);
}

function getPublic(
  url = 'http://api.ipify.org',
  // url = 'http://icanhazip.com',
  // url = 'http://fugal.net/ip.cgi',
  timeout = 1000,
  useCache = true) {

  return cache('public', get, useCache);

  function get() {
    return timeoutPromise(new Promise((resolve, reject) => http.request(url, res => {
      if (res.statusCode != 200) return reject(error(res.statusCode))
      res.setEncoding('utf-8');
      let ipAddress = '';
      res.on('data', chunk => ipAddress += chunk);
      res.on('end', () => resolve(ipAddress));
    }).on('error', err => {
      reject(error(err));
    }).end()), timeout);
  }

  function error(error) {
    return new Error(`Couldn't get Public IP Address. Error: ${error && error.message || error}`);
  }
}

function getAllIPs(useCache = true) {
  return useCache && cache.all || (cache.all = Array.from(generate()));

  function* generate() {
    const interfaces = os.networkInterfaces();
    for (const interface in interfaces) {
      for (const ip of interfaces[interface]) {
        yield ip;
      }
    }
  }
}

function delayPromise(delay = 1000) {
  return new Promise(((resolve, reject) => setTimeout(resolve, delay)));
}

function timeoutPromise(...promises) {
  let delay = promises.pop();
  if (delay.then) {
    promises.push(delay);
    delay = null;
  }
  return Promise.race([...promises, delayPromise(delay).then(() => { throw new Error('Timed out') })]);
}

function catchFn(fn, onError) {
  return (...args) => {
    try {
      const result = fn(...args);
      if (result && result.then) {
        return result.catch(e => error(e, ...args));
      } else return result;
    } catch (e) {
      return error(e, ...args);
    }
  }

  function error(error, ...args) {
    if (typeof onError === 'function') return onError(error, ...args);
    else {
      console.error(error);
      return onError || error;
    }
  }
}
