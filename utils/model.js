const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

 export function read(fileName) {
  let data = readFileSync(resolve('database', fileName + '.json'), 'utf-8')
  return JSON.parse(data)
}


 export function write(fileName, data) {
  writeFileSync(resolve('database', fileName + '.json'), JSON.stringify(data, null, 4))
  return true
}


