const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // create checkout session
  const session = await stripe.checkout.sessions.create({
    // mode: 'payment',
    // payment_method_types: ['card'],
    payment_method_types: ['card'],
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${
                tour.imageCover
              }`,
            ],
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    // success_url: `${req.protocol}://${req.get('host')}/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    success_url: `${req.protocol}://${req.get('host')}/my-tours`,
    // success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
  });
  // create session as response
  res
    .status(200)
    // .set(
    //   'Content-Security-Policy',
    //   "default-src 'self' https://*.mapbox.com https://js.stripe.com/v3/;   connect-src 'self' 'unsafe-inline' blob: data: gap: ws: https://*.mapbox.com http://127.0.0.1:8000 https://*.cloudflare.com https://r.stripe.com https://checkout.stripe.com https://api.stripe.com;    base-uri 'self';block-all-mixed-content;    font-src 'self' https: data:;   frame-ancestors 'self';   img-src 'self' data: https://*.stripe.com;    object-src 'none';    script-src 'self' https://js.stripe.com/v3/ https://cdnjs.cloudflare.com https://api.mapbox.com blob: https://r.stripe.com https://js.stripe.com/v3/ https://checkout.stripe.com;   frame-src 'self' https://checkout.stripe.com https://js.stripe.com, https://hooks.stripe.com;img-src https://*.stripe.com;    script-src-attr 'none';   style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests;"
    // )
    .json({
      status: 'success',
      // send back payment session stripe form
      session,
    });
});

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   // THis is only TEMPORARY, because it's unsecure
//   const { tour, user, price } = req.query;

//   if (!tour && !user && !price) return next();

//   await Booking.create({
//     tour,
//     user,
//     price,
//   });
//   res.redirect(req.originalUrl.split('?')[0]);
// });

const createBookingCheckout = async session => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total / 100;

  await Booking.create({
    tour,
    user,
    price,
  });
};

exports.webhookCheckout = catchAsync(async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_KEY
    );
  } catch (err) {
    return res.status(400).send(`webhook error:  ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    createBookingCheckout(event.data.object);

    res.status(200).json({ received: true });
  }
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
