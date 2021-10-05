const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email Not Valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length <= 6 || !value.match(/[0-9]/)) {
          throw new Error(
            "Password must contain number and be of length greater than 6"
          );
        }
      },
    },
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

//generate auth webtoken
userSchema.methods.generateWebToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  //   user.tokens.push({ token });
  //   await user.save();
  return token;
};

//validating the login
userSchema.statics.findByCreds = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login!");
  }
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login!");
  }
  return user;
};

//password hashing
userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    user.password = bcrypt.hashSync(user.password, 12);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
