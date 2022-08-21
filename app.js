const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARE
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
// app.use(helmet());
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);

// //Further HELMET configuration for Security Policy (CSP)
const scriptSrcUrls = [
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://*.cloudflare.com',
  'https://js.stripe.com/v3/',
  'https://checkout.stripe.com',
];
const styleSrcUrls = [
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
  'https://www.myfonts.com/fonts/radomir-tinkov/gilroy/*',
  ' checkout.stripe.com',
];
const connectSrcUrls = [
  'https://*.mapbox.com/',
  'https://*.cloudflare.com',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:52191',
  '*.stripe.com',
  'ws:',
];

const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", 'https:', 'http:', 'blob:', ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: ["'self'", 'blob:', 'data:'],
      fontSrc: ["'self'", 'https:', 'http:', 'data:', ...fontSrcUrls],
      frameSrc: ['*.stripe.com', '*.stripe.network'],
    },
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // logger
}

// limit 100 request from Ip in 1 hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in a hour!',
});
app.use('/api', limiter);

// limit 3 login attempts from user
// const limiterLogin = rateLimit({
//   max: 3,
//   windowMs: 60 * 1000,
//   message: 'Too many attempts, please try again in a minute!',
// });
// app.use('/api/v1/users/login', limiterLogin);

// body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // for getiing form from URL
app.use(cookieParser());

// Data sanitizaiton against NoSQL query injection
app.use(mongoSanitize());

// Data sanitizaiton against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    // allow duplicate parameters
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// handle error not found routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
