const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'https://backend-finances-ms-transactions.onrender.com/',
    secure: false,
    logLevel: 'debug'
  }
];

module.exports = PROXY_CONFIG; 