const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(err, null); // was (null, 0);
    } else {
      let data;
      if (fileData.length === 0) {
        data = '0';
      } else {
        data = fileData.toString();
      }
      callback(null, Number(data));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  let counter = null;
  let id = null;
  let error = null;
  readCounter((err, num) => {
    if (err) {
      error = new Error('error reading counter and ' + err.toString());
      //console.log(error);
    } else {
      counter = num;
      counter = counter + 1;
      writeCounter(counter, (err, numString) => {
        if (err) {
          error = new Error('error writing counter and ' + err.toString());
        } else {
          id = numString;
        }
        callback(error, id);
      });
    }
  });
};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
