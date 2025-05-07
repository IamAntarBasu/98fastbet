const { createProxyMiddleware } = require('http-proxy-middleware');

// This file is only used in development mode
// In production, the REACT_APP_API_URL environment variable is used
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        // Add any required headers here
        proxyReq.setHeader('Accept', 'application/json');
      },
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({ 
          success: false, 
          message: 'Proxy error', 
          error: err.message 
        }));
      }
    })
  );
}; 
