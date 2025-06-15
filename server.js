const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('public'));

// Ensure ips.txt exists
const logFile = 'ips.txt';
if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, '');
}

app.get('/', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`Visitor IP: ${ip}`);
  fs.appendFileSync(logFile, `${new Date().toISOString()} - ${ip}\n`);
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`IP Logger running at http://localhost:${port}`);
});
