let read = require('fs').readFileSync
let {join} = require('path')

let dictionary = read(join(__dirname, 'dictionary.txt')).toString()
dictionary = dictionary.split('\n')
dictionary.unshift(/[KMG]B/) // Data quantities, ostensibly

module.exports = dictionary
