const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //create a file using fs module
  counter.getNextUniqueId((err, id) =>{
    // handle error,
    if (err) {
      throw ('error writing todo');
    } else {
    // otherwise
    // fs.writefile
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => { // -----> data/0001.txt
        if (err) {
          throw ('error writing todo file');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, (err, fileData) => {
    // console.log('this is the file data ', fileData);
    if (err) {
      throw ('error reading directory');
    } else {
      var result = [];
      fileData.forEach((file)=>{
        var id = file.replace('.txt', '');
        // create obj set properties and then push
        result.push({
          'id': id,
          'text': id
        });
      });
      // console.log('This is our id objects array >>>>>: ', result);
      callback(null, result);
    }
  });
};
// result is gonna look like this ----> [{ id: '00001', text: '00001' }, { id: '00002', text: '00002' }];

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, fileData) => { // <--- directory, using the right id
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      // console.log('file data inside  ', fileData.toString());
      callback(null, { id, text: fileData.toString() });
    }
  });

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
