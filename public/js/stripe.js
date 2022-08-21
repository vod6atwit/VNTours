/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    // public key
    const stripe = Stripe(
      'pk_test_51LYFzpHfwLOevx7wY5FQBpYiy8dcvqE76BKnrIxv9ZrnDHMbPuDTuo0BH7HsEPN5HGgorYaoHiMAYFT5MciOwge800CZMh7RRB'
    );
    // get checkout session from API - bookingController
    const session = await axios(
      `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    //create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
  }
};
