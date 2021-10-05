const express = require("express");
const path = require("path");
const hbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo");
const userRouter = require("./src/Routers/users");
const storyRouter = require("./src/Routers/stories");
const flash = require("express-flash");

require("./src/db/mongoose");
// require("./src/middleware/localStrategy");
require("./src/middleware/googleStrategy");
// require("./src/middleware/facebookStrategy");

const app = express();
const port = process.env.PORT;

//path of public directories
const publicDirectory = path.join(__dirname, "public");

//helpers
const {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select,
} = require("./helpers/hbs");

//hbs setting
app.engine(
  "hbs",
  hbs({
    helpers: { formatDate, truncate, stripTags, editIcon, select },
    defaultLayout: "main",
    extname: "hbs",
  })
);
app.set("view engine", "hbs");

//setting public directory and parsing the body
app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

//method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//session setting
app.use(
  session({
    secret: "holy cow",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(userRouter);
app.use(storyRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
