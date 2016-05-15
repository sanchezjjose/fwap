'use strict';

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let handlebars = require('express-handlebars');
let app = express();
let env = app.get('env');

let webRoutes = require('./routes/index');
let alexaRoutes = require('./routes/alexa');

app.set('views', path.join(__dirname, 'views'));
app.engine('.html', handlebars({
  defaultLayout: 'layout',
  extname: '.html',
  helpers: {
    // TODO: move this to separate middleware
    'equals': function (one, two, options) {
      if (one === two) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    'contains': function (elem, list, options) {
      if (list.indexOf(elem) > -1) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    'section': function(name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
}));
app.set('view engine', '.html');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function(req, res, next) {

    if(env !== 'development' && req.headers['x-forwarded-proto'] !== 'https') {
        res.redirect('https://whatsgood.herokuapp.com' + req.url);

    } else {
        next();
    }
});

app.use('/', webRoutes);
app.use('/api/v1', alexaRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Development error handler
if (env === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: err
      });
    });
}

// Production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
