const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'log.txt');


http.createServer((request, response) => {
  let addr = request.url,
    q = new URL(addr, 'http://localhost:8080'),
    filePath = '';

    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${request.url}\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Failed to write to log.txt:', err);
      }
    });

    if (q.pathname.includes('documentation')) {
      filePath = (__dirname + '/documentation.html');
    } else {
      filePath = 'index.html';
    }
  
    fs.readFile(filePath, (err, data) => {
      if (err) {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.write('404 Not Found');
      response.end();
      } else{
  
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(data);
      response.end();
}

  
    });
  
  }).listen(8080);
  console.log('My test server is running on Port 8080.');