var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors'); // Para permitir peticiones desde tu frontend Angular
const db = require('./models'); // Importa tu configuración de Sequelize
const bodyParser = require('body-parser');
// Importa tus rutas de autenticación
const authRoutes = require('./routes/authRoutes');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Sincronizar la base de datos (solo para desarrollo, usar migraciones en producción)
// db.sequelize.sync({ force: false }).then(() => { // No uses force: true en producción, borra los datos
//   console.log('Base de datos sincronizada.');
// }).catch(err => {
//   console.error('Error al sincronizar la base de datos:', err);
// });
// view engine setup

// Middleware
app.use(cors()); // Habilita CORS para todas las rutas
app.use(logger('dev'));
app.use(bodyParser.json()); // Para parsear el body de las peticiones en JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para parsear URLs codificadas
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ** 4. Rutas de la API **
// Agrega tus rutas de autenticación con un prefijo
app.use('/api/auth', authRoutes);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
