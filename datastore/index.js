const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id, error;
  counter.getNextUniqueId((err, num) => {
    id = num;
    error = err;
    if (error) {
      console.log(error);
    }
    items[id] = text;
    //find todoPath given ID and dataDir
    let todoPath = path.join(exports.dataDir, id + '.txt');
    // figure out what 'data' to write
    let data = text;
    // write data to file at todoPath
    fs.writeFile(todoPath, data, (err) => {
      if (err) {
        console.log(err);
      }
      callback(err, { id, text });
    });
  });
};

exports.readAll = () => {
  let err = null;
  let data = [];
  return (Promise.promisify(fs.readdir))(exports.dataDir)
    .then((files) => {
      let promises = [];
      for (var i = 0; i < files.length; i++) {
        let split = files[i].split('.');
        let el = split[0];
        data.push({id: el, text: null});
        promises.push((Promise.promisify(fs.readFile))(files[i]));
      }
      return promises;
    })
    .then((promises) => (Promise.all(promises)))
    .then((texts) => {
      for (var i = 0; i < texts.length; i++) {
        data[i].text = texts[i];
      }
      return data;
    });
  // }) (err, files) => {
  //   for (var i = 0; i < files.length; i++) {
  //     let split = files[i].split('.');
  //     let el = split[0];
  //     data.push({
  //       id: el,
  //       text: el
  //     });
  //   }
  //   callback(err, data);
  // });
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
      let split = files[i].split('.');
      let elt = split[0];
      data.push(elt);
    }
    if (data.includes(id)) {
      fs.writeFile(todoPath, text, (err) => {
        callback(err, {id, text});
      });
    } else {
      callback(new Error(`update error: no item with id: ${id}`), null);
    }
  });
};

exports.delete = (id, callback) => {
  let todoPath = path.join(exports.dataDir, id + '.txt');
  fs.access(todoPath, fs.constants.F_OK, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(todoPath, (err) => {
        callback(err);
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};