const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOvveride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

//Initialisations
const app = express();
require('./database');
require('./config/passport');

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(express.urlencoded ({extended:false})); //recibir datos del usuario
app.use(methodOvveride('_method')); //para enviar PUT DELETE...
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialize: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global Variables
app.use((req,res, next) => {
    res.locals.success_msg= req.flash("success_msg");
    res.locals.error_msg= req.flash("error_msg");
    res.locals.error= req.flash("error");
    res.locals.user= req.user || null;
    next();
});

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/notes'));

//Static Files
app.use(express.static(path.join(__dirname, 'public')));


//Server Listening
app.listen(app.get('port'), () => {
    console.log("Server on port ", app.get('port'));
});

//date helper
var hbs = exphbs.create({});
var moment = require('moment'); // require
hbs.handlebars.registerHelper('formatTime', function (date, format) {
    var mmnt = moment(date);
    return mmnt.format(format);
});

//show if element exists
hbs.handlebars.registerHelper('exists', function (element, options) {
    'use strict';
        if (element) {
            return options.fn(this);
        }
        return options.inverse(this);
    });