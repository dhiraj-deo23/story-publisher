# story-publisher

Publish your stories. Option to keep private.

This app uses Node.js/Express/MongoDB with Facebook OAuth, Google OAuth, and Local Auth for authentication, implemented using passport.

Usage
Create a config folder and add dev.env file.
Add your mongoDB URI and Google OAuth, facebook auth or JWT secret (if using JWT) credentials to the dev.env file.

# Install dependencies
npm install

# Run in development
npm run dev

# Run in production
npm start
