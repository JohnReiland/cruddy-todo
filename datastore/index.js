const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id, error;
  counter.getNextUniqueId((err, num) => {
    id = num;
    error = err;
    items[id] = text;
    //find todoPath given ID and dataDir
    let todoPath = path.join(exports.dataDir, id + '.txt');
    // figure out what 'data' to write
    let data = text;
    // write data to file at todoPath
    fs.writeFile(todoPath, data, (err) => {
      callback(err, { id, text });
    });
  });
};

exports.readAll = (callback) => {
  // get an array of objects with id and text field?
  // we can fill in text with id not real text for now.
  let err = null;
  let data = [];

  // console.log('data array, pre-readDir: ' + JSON.stringify(data));

  // for (let id in items) { //for.. in is not the way to do this; instead, read directory contents and loop over them

  console.log('dataDir: ' + exports.dataDir);
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw err;
    }
    if (files.length > 0) {
      console.log('files: ' + files + ' files is array?: ' + (Array.isArray(files)) + ' element is of type: ' + (typeof files[0]));
    }
    for (var i = 0; i < files.length; i++) {
      let split = files[i].split(".");
      let el = split[0]
      console.log('el: ' + el)
      data.push({
        id: el,
        text: el
      })
      console.log('data array, mid-readDir: ' + JSON.stringify(data));
    }
  });
  console.log('data array, post-readDir: ' + JSON.stringify(data));
  // let text = id;
    //let todoPath = path.join(exports.dataDir, id + '.txt');
    //text = fs.readFile(todoPath); // this will be done later.
  // let obj = { id, text };
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  callback(err, data); //callback(null, data) //originally
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};