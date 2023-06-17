const fs = require('fs');
const { exec } = require('child_process');

const files = [
  './background.js',
//   './instant.js',
//   './lever.js',
  './gmail.js',
//   './ashbyhq.js',
//   './bamboohr.js',
//   './submitlever.js',
  './accesstoken.js',
];

const output = 'dist/extension.min.js';

const joinedFiles = files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');

fs.writeFileSync('temp.js', joinedFiles, 'utf8');

exec(
  `npx google-closure-compiler --js temp.js --js_output_file ${output}`,
  (error, stdout, stderr) => {
    fs.unlinkSync('temp.js'); // Remove temporary file
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error: ${stderr}`);
      return;
    }
    console.log('Build successful');
  }
);
