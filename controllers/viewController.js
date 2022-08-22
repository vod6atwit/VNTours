const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Booking = require('../models/bookingModel');
// const User = require('../models/userModel');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediately, please come back later.";

    next();
  }
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // get tour data from collection
  const tours = await Tour.find();

  // build template

  // render template using tour data
  res.status(200).render('overview', {
    title: 'All Tours', // set default title
    tours, // pass tour to overview template
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // console.log(req.params.slug);
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // console.log(tour);
  res
    .status(200)
    // .set(
    //   'Content-Security-Policy',
    //   "default-src 'self' https://*.mapbox.com https://js.stripe.com/v3/;connect-src self 'unsafe-inline' blob: data: gap: ws: https://*.mapbox.com http://127.0.0.1:8000 https://*.cloudflare.com https://js.stripe.com/v3/;base-uri 'self';block-all-mixed-content; font-src 'self' https: data:; frame-ancestors 'self';img-src 'self' data:; object-src 'none'; script-src https://js.stripe.com/v3/ https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ; script-src-attr 'none'; style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests;"
    // )
    .render('tour', {
      title: `${tour.name} tour`,
      tour,
    });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up new account',
  });
};

exports.getAccount = async (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // find all bookings with user
  const bookings = await Booking.find({
    user: req.user.id,
  });

  // find all tourID with the returned user IDs
  const tourIDs = bookings.map(el => el.tour);

  // find all tours with the returned tourID
  const tours = await Tour.find({
    _id: { $in: tourIDs },
  });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

// exports.updateUserData = catchAsync(async (req, res, next) => {
//   // console.log(req.body);
//   const updateUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     {
//       new: true,
//       runValidations: true,
//     }
//   );

//   res.status(200).render('account', {
//     title: 'Your account',
//     user: updateUser,
//   });
// });
