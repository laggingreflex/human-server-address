module.exports = (address, { protocol = 'http://', unspecified = 'localhost' } = {}) => {

  if (typeof address === 'string') return address;
  if (!address.address && address.port) throw new Error('Invalid server address object');

  const host = ['0.0.0.0', '::'].includes(address.address) ? unspecified : address.address;
  const port = [80].includes(address.port) ? '' : ':' + address.port;

  return protocol + host + port;
}
