var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));                                                                     
var yaml = require('js-yaml');


var vinylFs  = require( 'vinyl-fs' ),
    map      = require( 'map-stream' );
    stream = require('stream');  
    es = require('event-stream');
    merge = require('deepmerge')

/* utility */
var getContents = function(file, cb) {
    cb(null,file.contents);
};

var getPath = function(file, cb) {
    cb(null,file.relative);
};

function contractNameStream(contractName) {
    return vinylFs.src( [ './meta/' + contractName + '.json' ] )
      .pipe( map(getContents) );
}

/* all contract names, just checking for their presence */
function contractsStream() {
    return vinylFs.src( [ './contracts/*.sol' ] )
      .pipe( map(getPath) );  
}

/* emits all contract metadata as json */
function contractsMetaStream() { 
    return vinylFs.src( [ './meta/*.json' ] )
      .pipe( map(getContents) )
      .pipe( es.map(function (data, cb) {
         cb(null, JSON.parse(data))
       }));
}

/* emits config as json */
function configStream() {
  return vinylFs.src( [ './config.yaml' ] )
      .pipe( map(getContents) )
      .pipe( es.map(function (data, cb) {
         cb(null, yaml.safeLoad(data))
       }));
}

/* emits all the keys as JSON */ 
function keysStream() {
  return vinylFs.src( [ './key*.json' ] )
      .pipe( map(getContents) )
      .pipe( es.map(function (data, cb) {
         cb(null, JSON.parse(data))
       }));
}

// collects a bunch of data, makes an array out of it, and emits it 

function collect() {

  var a = new stream.Stream ()
    , array = [], isDone = false;
 
  a.write = function (l) {
    array.push(l);
  }

  a.end = function () {
    isDone = true;
    this.emit('data', array);
    this.emit('end');
  }

  a.writable = true;
  a.readable = true;

  a.destroy = function () {
    a.writable = a.readable = false;
    
    if (isDone) return;
  }

  return a;
}

function fuseStream() {
  var toFuse = [].slice.call(arguments);
  if (toFuse.length === 1 && (toFuse[0] instanceof Array)) {
    toFuse = toFuse[0];
  }

  var strm = new stream.Stream();
  strm.setMaxListeners(0);

  var endCount = 0;
  var dataObj = {};

  strm.writable = strm.readable = true;

  toFuse.forEach(function (e) {
    e.pipe(strm, {end: false});
    var ended = false;

    e.on('end', function () {
      if(ended) return;
      ended = true;
      endCount++;

      if(endCount == toFuse.length) {
         strm.emit('data', dataObj);
         strm.emit('end');
      }
    })
  })

  strm.write = function (data) {
    dataObj = merge(data,dataObj);
  }
  strm.destroy = function () {
    toFuse.forEach(function (e) {
      if(e.destroy) e.destroy()
    })
  }
  return strm;
}

module.exports  = {
  keysStream :  keysStream,
  contractNameStream : contractNameStream,
  contractsStream : contractsStream,
  contractsMetaStream : contractsMetaStream,
  configStream : configStream,
  collect : collect,
  fuseStream : fuseStream
};
