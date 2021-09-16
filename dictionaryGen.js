var fs = require('fs')

let dictionary = fs.readFileSync('./dictionary.txt', 'utf-8');
let dictionaryArray = dictionary.split(('\n'));
console.log(dictionaryArray);