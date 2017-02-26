//Import dependencies
var fs = require('fs');
var readline = require('readline');

//Tabson object
module.exports = function(file, opt, cb)
{
  //Check the option
  if(typeof opt === 'function'){ var cb = opt; }

  //Check the option
  if(typeof opt !== 'object'){ var opt = {}; }

  //Check the encoding
  if(typeof opt.encoding === 'undefined'){ opt.encoding = 'utf8'; }

  //Check the separator
  if(typeof opt.sep === 'undefined'){ opt.sep = '\t'; }

  //Set the empty value
  if(typeof opt.empty === 'undefined'){ opt.empty = ''; }

  //Check the output type
  if(typeof opt.type === 'undefined'){ opt.type = 'object'; }

  //Output content
  var out = { header: [], data: [] };

  //Initialize the file reader
  var reader = readline.createInterface({ input: fs.createReadStream(file).setEncoding(opt.encoding) });

  //Catch the error
  reader.on('error', function(error){ return cb(error, [], []); });

  //Read a new line
  reader.on('line', function(line)
  {
    //Check the header
    if(out.header.length === 0)
    {
      //Save the header
      out.header = line.split(opt.sep);

      //Continue
      return true;
    }

    //Split the line
    line = line.split(opt.sep);

    //Check the output type
    if(opt.type === 'array')
    {
      //Save the line
      out.data.push(line);

      //Continue
      return true;
    }

    //Line object
    var obj = {};

    //Read all the columns
    for(var i = 0; i < out.header.length; i++)
    {
      //Save the value
      obj[out.header[i]] = (typeof line[i] === 'undefined') ? opt.empty : line[i];
    }

    //Save the line
    out.data.push(obj);

    //Continue
    return true;
  });

  //End the file
  reader.on('close', function(){ return cb(false, out.header, out.data); });
};
