const jwt = require("jsonwebtoken");
const User = require("../Models/Users");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      throw new Error("Please login");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
    });
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send({ error: err });
  }
};

const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/");
  }
};

const ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    next();
  }
};

module.exports = {
  auth,
  ensureAuth,
  ensureGuest,
};
