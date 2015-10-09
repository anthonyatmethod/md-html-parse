var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var routes = require('./routes/index');
var users = require('./routes/users');
var mkdirp = require('mkdirp');
var del = require('del');
var _ = require('lodash');
var path = require('path');



var app = express();

// express handlebars .est
var expressHandlebars = require('express-handlebars');
app.set('views', path.join(__dirname, 'handlebars-root'));
app.engine('.hbs', expressHandlebars({
  defaultLayout: 'layout',
  extname: '.hbs'
}));


app.set('view engine', '.hbs'); //node app .est
console.log('starting generation of your blog.');

//markdownit .est
var md = require('markdown-it')();
var result = md.render('# markdown-it running!');
console.warn(result);

//slimdown.js .est
var slimdown = require('./slimdown');

// console.warn(slimdown.render('#  Title\n\nAnd *now* [a link](http://www.google.com) to **follow** and [another](http://yahoo.com/).\n\n* One\n* Two\n* Three\n\n## Subhead\n\nOne **two** three **four** five.\n\nOne __two__ three _four_ five __six__ seven _eight_.\n\n1. One\n2. Two\n3. Three\n\nMore text with `inline($code)` and :"quote": sample.\n\n> A block quote\n> across two lines.\nMore text...'));

//read the markdown-root folder recursively
var mdFolder = 'markdown-root';
var hbsFolder = 'handlebars-root';
var htmlFolder = 'html-root';

del.sync('./' + hbsFolder + '/*');
del.sync('./' + htmlFolder + '/*');

// walker .est
require('walker')('./markdown-root')
  .on('dir', function(dir, stat) {
    console.warn('creating : ', dir);
    mkdirp.sync(dir.replace(mdFolder, hbsFolder), function(err) {
      console.error(err);
    });
  })
  .on('file', function(file, stat) {
    console.log('Got file: ' + file);
    var markDownContent = fs.readFileSync(file, 'utf8');
    var handlebarsContent = slimdown.render(md.render(markDownContent)); //convert to handlebars
    var newFileName = (file.split('.md')[0] + '.hbs').replace(mdFolder, hbsFolder);
    console.log('newNewFileName', newFileName);
    fs.writeFileSync(newFileName, handlebarsContent); //write the output in the corresponding folder in the handlebar-root folder
  })
  .on('end', function() {
    console.info('generated the HBS files successfully!');

    require('walker')('./' + hbsFolder)
      .on('dir', function(dir, stat) {
        console.warn('creating : ', dir);
        var htmlFileName = path.join(htmlFolder,dir.split('/').shift());
        htmlFileName+=".html";
        console.log('-------------------------',htmlFileName)
        //removes the first folder name, and adds html to the end of path
        //var htmlFileName = htmlFolder + '/' + (dir.split('/').shift()) + '.html';
        // var htmlFileName = htmlFolder + '/' + (dir.split('/').shift().join('/')) + '.html';

        //should point to index or page2 folders
        // var handleBarsRoot = dir.split('/').shift().join('/');


        console.warn('htmlFileName', htmlFileName);


        app.set('views', path.join(__dirname, 'handlebars-root' + dir));
        app.render('templateName', function(html, err) {
          if (err) {
            console.log(err);
          }
          fs.writeFileSync(htmlFileName, html);
        });
      })

    .on('end', function() {
      console.info('generated the HTML files successfully! Enjoy!');
    })

  });


//TODO: grab folder name :  index  and folder path

//TODO: set that folder as views root to handlebars

//TODO: genertate index.html file

//TODO: write the content to html-root/index.html   //  html-root/subfolder1/subpage1.html

//TODO:  spinup the html server and serve html-root as static.

// view engine setup



app.set('views', path.join(__dirname, 'handlebar-views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'html-root')));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
