module.exports = (server, { protocol = 'http://', unspecified = 'localhost' } = {}) => {
  if (!server || typeof server.address !== 'function') throw new Error('Invalid server object');

  const address = server.address();
  if (typeof address === 'string') return address;

  const host = ['0.0.0.0', '::'].includes(address.address) ? unspecified : address.address;
  const port = [80].includes(address.port) ? '' : ':' + address.port;

  return protocol + host + port;
}
