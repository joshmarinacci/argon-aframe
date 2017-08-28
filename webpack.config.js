const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'argon-aframe.js',
        path: path.resolve(__dirname, 'dist')
    }
};