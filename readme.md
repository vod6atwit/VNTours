# **_nasa-project_**

![]()

## **Content Overview:**

- [**_VNtours_**](#Introduction)
  - [**Content Overview:**](#content-overview)
    - [**The project main idea:**](#the-project-main-idea)
    - [**Postman APIs:**](#postman-apis)
    - [**Architecture:**](#architecture)
    - [**Error handling:**](#error-handling)
    - [**Data Modeling:**](#data-modeling)
    - [**Security Features Implemented:**](#security-features-implemented)
    - [**Stripe Implementation & Stripe webhooks logic:**](#stripe-implementation--stripe-webhooks-logic)
    - [**Technologies & Third services:**](#technologies--third-services)
    - [**coming improvement:**](#coming-improvement)

<br><br>

### **Introduction**

VNtours is a full-stack web application used to booking tours in Vietnam

Live Website hosted on Heroku <a href="https://vntours-vod6.herokuapp.com/" target="_blank">VNtours</a>

### **Features:**

Users can purchase travel via bank card, create an account, log in and log out,
with the ability to reset their password and update their data (name, photo, and email basically), with an improved user experience. An emailing feature
is provided each time a user signup or purchases travel.

<br>

### **Postman APIs:**

Please refer to this <a href="https://documenter.getpostman.com/view/22527187/VUjSFPLB" target="_blank">link</a> to get more details about APIs.

<br>

### **Architecture:**

<br>

**Project Directory structure:**

```
goAheadTravel/
├── controllers
│   ├── authController.js
│   ├── bookingController.js
│   ├── errorController.js
│   ├── factoryHandler.js
│   ├── ratingController.js
│   ├── travelController.js
│   ├── userController.js
│   └── viewsController.js
├── dev-data
│   └── data
│       ├── import-dev-data.js
│       ├── reviews.json
│       ├── tours.json
│       └── users.json
├── models
│   ├── bookingModel.js
│   ├── reviewModel.js
│   ├── tourModel.js
│   └── userModel.js
├── public
│   ├── css
│   │   └── styles.css
│   ├── img
│   │   ├── tours
│   │   └── users
│   └── js
│   │   ├── alerts.js
│   │   ├── bundle.js
│   │   ├── bundle.js.map
│   │   ├── index.js
│   │   ├── login.js
│   │   ├── mapbox.js
│   │   ├── signup.js
│   │   ├── stripe.js
│   │   └── updateSettings.js
│   └── overview.html
│   └── tour.html
├── routes
│   ├── bookingRoutes.js
│   ├── reviewRoutes.js
│   ├── tourRoutes.js
│   ├── userRoutes.js
│   └── viewRoutes.js
├── utils
│   ├── apiFeatures.js
│   ├── appError.js
│   ├── catchAsync.js
│   └── email.js
└── views
│   ├── emails
│   │   ├── _style.pug
│   │   ├── baseEmail.pug
│   │   ├── passwordReset.pug
│   │   └── welcome.pug
│   ├── _footer.pug
│   ├── _header.pug
│   ├── _reviewCard.pug
│   ├── account.pug
│   ├── base.pug
│   ├── error.pug
│   ├── login.pug
│   ├── overview.pug
│   ├── signup.pug
│   └── tour.pug
├── app.js
├── package.json
├── README.md
├── server.js
```

<br><br>

**Application architecture:**

This project builds with NodeJs, MongoDB JavaScript, CSS, PUG and MongoDB.

<br>

<img src="./readmeImage/app architecture.png">

<br><br>

**Node backend with:**

- <ins>ExpressJs:</ins> for design Rest APIs, define middlewares, manage routings, HTTP request, error handling ...
- <ins>Mongoose:</ins> for data modeling, schema building, document middleware, and business logic
- <ins>MongoDB Atlas:</ins> for database hosting
- <ins>Nodemailer:</ins> Node module for sending emails to users (example: reset password)
- <ins>cryptojs:</ins> for encrypt password and token
- <ins>JSON Web Token (JWT):</ins> for authenticate users
- <ins>Stripe:</ins> for online payments via bank card
- <ins>Gmail:</ins> SMTP service provider for emailing users whenever they signed up, attempt to update their passwords, or booked a travel
- <ins>Multer:</ins> for uploading images
- <ins>Sharp:</ins> for converting large images to web friendly jpeg and resizing images

<br>

**Frontend with:**

- <ins>Javascript:</ins> for building APIs, and rendering user interfaces dynamically
- <ins>Axios:</ins> for fetching APIs
- <ins>Parcel-bundler:</ins> for web application bundling
- <ins>CSS:</ins> for styling the web application
- <ins>PUG:</ins> for building templates

<br>

**MVC architecture:**

The MVC architecture used here, is a way to structure the application development in three layers:

- <ins>Business logic layer:</ins> represented in Model folder, with mongoose schema choosing which information and data
  represnting to clients and is the layer that the hole application build around.
- <ins>Application logic layer:</ins> represented in Controler folder, build around javascript functions to handle application's requests interact with models and send back response to clients.
- <ins>Presentation logic layer:</ins> represented in Views folder consists basically of the templates used to generate the view, so the website that we're going to send back to the clients.

<br>

<img src="./readmeImage/MVC architecture.png">

<br><br>

### **Error handling:**

<br>

<img src="./readmeImage/error handling.png">

<br><br>

### **Data Modeling:**

<br>

<img src="./readmeImage/data modeling.png">

<br><br>

### **Security Features Implemented:**

<br>

VNtours project includes a bunch of common security features that prevents common web applications attacks and threats, below a summary:

- 🚨️ COMPROMISED DATABASES:

  - 👉️ The main idea: The attacker try to guess the password by trying millions and millions of passwords until he find the right one.
  - ✅️ preventive measures implemented:
    - Strongly encrypt passwords using salt and hash (bcrypt)
    - Strongly encrypt passwords reset token (SHA 256)

- 🚨️ BRUTE FORCE ATTACKS:

  - 👉️ The main idea: The attacker try to guess the password by trying millions and millions of passwords until he find the right one.
  - ✅️ preventive measures implemented:
    - Use bcrypt (to make login requests slow)
    - Implement rate limiting (express-rate-limit)
    - Implement maximum login attempts

- 🚨️ CROSS-SITE SCRIPTING (XSS) ATTACKS:

  - 👉️ The main idea: The attacker try to inject scripts in our page to run his milicious code. On the client's side, this is especially dangerous because it allows the attacker to read the localstorage, which is the reason that why we never store the JWT in localstorage.
  - ✅️ preventive measures implemented:
    - Store JWT in HTTPOnly cookies (so the user can send and recieve cookie instead of the JWT)
    - Sanitize user input data
    - Set especial HTTP headers (helmet package)

- 🚨️ DENIAL-OF-SERVICE ATTACKS:

  - 👉️ The main idea: It happens when the attacker send so many requests to a server that it breaks down and the application becomes unavailable.
  - ✅️ preventive measures implemented:
    - Implement rate limiting (express-rate-limit)
    - Limit playload data (send with patch and post requests)
    - Avoid Evil regular expressions (these regular expressions take an exponential time for non-matching inputs)

- 🚨️ NOSQL QUERIES INJECTION ATTACKS:
  - 👉️ The main idea: It happens when attackers instead of inputing valid data, injects some queries in order to create a query expressions that it gonna to translate to true Exp: logged in without providing a valid username and password.
  - ✅️ preventive measures implemented:
    - Use mongoose for mongoDB (because of schemaTypes)
    - Sanitize user input data

<br>

### **Stripe Implementation & Stripe webhooks logic:**

<br>

- **Backend-side:** set a route to create Stripe checkout session, which will contain informations about the travel to purchase like the name of the travel, the price, the currency,.. etc, along with user details such as the email, name. For that, the stripe secret key must be provided.

- **Frontend-side:** implemented a function that will call the Stripe checkout session from the server once the user hit the booking button and send it back to client and based on that session Stripe will create the checkout page and redirect the user to it, in order to fill it with the card number, expiration date,.. Then, Stripe will charge the credit card which means that the user data (credit card number, expiration date...) will not reach the web application server and this is very secure.

- **Stripe Webhook:** Once the booking event is successful, impelemented a function that retrieve data from the event object to create a new booking in the DB and send a confirmation email to user.

<br>

<img src="./readmeImage/stripe checkout.png">

<br><br>

### **Technologies & Third services:**

<br>

- Postman
- MongoDB Atlas/compass
- Parcel-bundler
- Stripe
- Mailtrap
- Mapbox
- Nodemailer
- SendGrid

<br><br>

### **Coming improvement:**

<br>

- attempts to rendering reset the password page
- Implement search tour feature
- improve users + admin&lead-guide profile dashbord (booked tours, list of all users, tours, list of users reviews...)
- Improve the web application responsiveness and design

<br><br>
