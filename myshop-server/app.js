var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');




var app = express();

/* 处理跨域 */
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', ['mytoken', 'Content-Type']);
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var addressRouter = require('./routes/address')
var commentsRouter = require('./routes/comments')
var goodsRouter = require('./routes/goods')
var goodsbuyRouter = require('./routes/goodsbuy');
var indexRouter = require('./routes/index');
var order_detailRouter = require('./routes/order_details');
var ordersRouter = require('./routes/orders');
var shoppingCartRouter = require('./routes/shoppingCart');
var supplierRouter = require('./routes/supplier');
var typeRouter = require('./routes/type');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login')


app.use('/address', addressRouter);
app.use('/comments', commentsRouter);
app.use('/goods', goodsRouter);
app.use('/goodsbuy', goodsbuyRouter);
app.use('/', indexRouter);
app.use('/order_detail', order_detailRouter);
app.use('/orders', ordersRouter);
app.use('/shoppingCart', shoppingCartRouter);
app.use('/supplier', supplierRouter);
app.use('/type', typeRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log(req)
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;