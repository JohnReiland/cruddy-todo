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
  let err = null;
  let data = [];
  fs.readdir(exports.dataDir, (err, files) => {
    for (var i = 0; i < files.length; i++) {
      let split = files[i].split(".");
      let el = split[0]
      data.push({
        id: el,
        text: el
      })
    }
    callback(err, data);
  });
};

exports.readOne = (id, callback) => {
  //get file path
  //then call read file
  let todoPath = path.join(exports.dataDir, id + '.txt');
  fs.readFile(todoPath, (err, data) => {
    if (data) {
      callback(err, {id, text: data.toString()});
    } else {
      callback(err, {id, text: null});
    }
  });

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  //just write to todoPath with text then callback within that
  let todoPath = path.join(exports.dataDir, id + '.txt');
  let data = [];
  fs.readdir(exports.dataDir, (err, files) => {
    for (var i = 0; i < files.length; i++) {
      let split = files[i].split(".");
      let elt = split[0];
      data.push(elt);
    }
    if(data.includes(id)) {
      fs.writeFile(todoPath, text, (err) => {
      callback(err, {id, text});
      })
    } else {
      callback(new Error("update error"), null);
    };
  });







  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
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