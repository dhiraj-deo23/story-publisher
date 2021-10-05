const express = require("express");
const router = express.Router();
const User = require("../Models/Users");
const { ensureGuest, ensureAuth } = require("../middleware/auth");
const passport = require("passport");
const Story = require("../Models/Story");

router.post("/register", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    res.redirect("login");
  } catch (err) {
    res.render("register", { status: 400, error: err });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// router.post("/login", async (req, res) => {
//   try {
//     const user = await User.findByCreds(req.body.email, req.body.password);
//     const token = await user.generateWebToken();
//     res.cookie("jwt", token, {
//       expires: new Date(Date.now() + 1000 * 60 * 24),
//       httpOnly: true,
//       //   secure: true,
//       sameSite: true,
//     });
//     res.redirect("/dashboardd");
//   } catch (err) {
//     res.render("login", { status: 500, error: err });
//   }
// });

router.get("/", ensureGuest, (req, res) => {
  res.render("loginstart");
});

router.get("/login", ensureGuest, (req, res) => {
  res.render("login");
});

//google authentication login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/dashboard");
  }
);

//facebook authentication login
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: [
      "user_friends",
      "email",
      "user_birthday",
      "user_gender",
      "user_link",
      "user_hometown",
    ],
  })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  })
);

router.get("/register", ensureGuest, (req, res) => {
  res.render("register");
});

router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ owner: req.user.id }).lean();
    res.render("dashboard", {
      user: req.user,
      displayName: req.user.displayName,
      stories,
    });
  } catch (err) {
    console.log(err);
    res.render("errors/500");
  }
});

router.get("/logout", ensureAuth, (req, res) => {
  //   res.clearCookie("jwt");
  req.logOut();
  res.redirect("/");
});
module.exports = router;
