/* eslint-disable */
const fs = require('fs')
const exec = require('child_process').exec
const async = require('async')

const scriptsFolder = './src/__tests__/all/' 
const files = fs.readdirSync(scriptsFolder) // reading test files 

console.log('starting')
const funcs = files.map(function(file) {
  return exec.bind(null, `npx ts-node ${scriptsFolder}${file}`)
})

console.log('exec')
function getResults(err, data) {
  if (err) {
    return console.log(err)
  }
  data.forEach(line => {
    line.forEach(item => {
        if (!item) return;
        console.log(item);
    });
  });
}

// parallel use
async.parallel(funcs, getResults);
