const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'pinggy.log');
const urlFile = path.join(__dirname, 'pinggy_url.txt');

// Clear existing logs
fs.writeFileSync(logFile, '');
fs.writeFileSync(urlFile, '');

console.log('Starting Pinggy tunnel...');

const ssh = spawn('ssh', [
  '-o', 'StrictHostKeyChecking=no',
  '-p', '443',
  '-R', '80:localhost:5173',
  'a.pinggy.io'
], {
  shell: true
});

ssh.stdout.on('data', (data) => {
  const str = data.toString();
  fs.appendFileSync(logFile, str);
  
  // Look for the URL (both http and https, supporting pinggy-free.link and pinggy.link/app)
  const match = str.match(/https?:\/\/[a-zA-Z0-9.-]+\.(?:pinggy|pinggy-free|run\.pinggy-free)\.(?:link|app)/);
  if (match) {
    fs.writeFileSync(urlFile, match[0]);
  }
});

ssh.stderr.on('data', (data) => {
  const str = data.toString();
  fs.appendFileSync(logFile, str);
});

ssh.on('close', (code) => {
  fs.appendFileSync(logFile, `\nProcess exited with code ${code}\n`);
});
