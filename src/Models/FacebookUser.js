const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    facebookId: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    hometown: {
      type: String,
    },
    birthday: {
      type: String,
    },
    friendsCount: {
      type: String,
    },
    email: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const FacebookUser = mongoose.model("FacebookUser", userSchema);

module.exports = FacebookUser;
