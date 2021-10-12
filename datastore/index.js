const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
var readFile = Promise.promisify(fs.readFile);

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
  var result = [];
  var promises = [];

  fs.readdir(exports.dataDir, (err, fileData) => {
    // console.log('this is the file data ', fileData);
    if (err) {
      throw ('error reading directory');
    } else {
      fileData.forEach((file)=>{
        promises.push(readFile(path.join(exports.dataDir, file))
          .then(function(contents) {
            console.log('i got from the chef ', contents.toString());
            var id = file.replace('.txt', '');
            var happyMeal = {
              'id': id,
              'text': contents.toString()
            };
            return happyMeal;
          })
          .catch(function(e) {
            console.log('Error reading file', e);
          }));
      });
    }
    //console.log('Promises Array>>>>>:', promises);
    Promise.all(promises)
      .then((values) => {
        console.log('values after promise all ', values);
        callback(null, values);
      });
  });
};


/*
  .then((profile) => {
    fs.writeFile(writeFilePath, JSON.stringify(profile), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.stringify(profile));
      }
    });
  })
*/

/* ORIGINAL READ ALL FUNCTION
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

*/

// result is gonna look like this ----> [{ id: '00001', text: '00001' }, { id: '00002', text: '00002' }];

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, fileData) => { // <--- directory, using the right id
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      //console.log('file data inside  ', fileData.toString());
      callback(null, { id, text: fileData.toString() });
    }
  });

};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, fileData) => { // <--- directory, using the right id
    if (err) {
      callback(new Error(`No file with this id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          throw ('could not update file');
        } else {
          callback(null, {id, text: text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(new Error(`No file with this id: ${id}`));
    } else {
      //should delete file;
      callback();
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
