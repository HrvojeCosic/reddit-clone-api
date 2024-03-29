const dotenv = require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comments');
const subredditRouter = require('./routes/subreddits');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/subreddits', subredditRouter);

// Handle production
if (process.env.NODE_ENV === 'production') {
	//Static folder
	app.use(express.static(__dirname + '/public'));

	//Handle Single page app
	app.get(/.*/, (req, res) => {
		res.sendFile(__dirname + '/public/index.html');
	});
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
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

mongoose.connect(
	process.env.DB_CONNECTION,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	},
	console.log('Connected to a DB!')
);

module.exports = app;
