if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate'); //for boilerplate
const ExpressError = require("./utils/expressErrors.js");
// const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


// Import Routes
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
.then(() => {
    console.log("connected to DB");
})
.catch(err => {
    console.error("Error connecting to the database", err);
});

async function main() {
  try {
    await mongoose.connect(dbUrl);  
  } catch (err) {
    console.error("Database connection error", err);
  }
}

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));
app.use(express.static('public'));
const session = require("express-session");


//for boilerplate
// app.engine('ejs', ejsMate); // Use ejs-mate
// app.set('view engine', 'ejs');
// app.set('views', __dirname + '/views'); 
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error" , (err) => {
  console.log("ERROR in MONGO SESSION STORE" , err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};



// app.get("/" , (req , res) => {
//   res.send("Hii i am root");
// });

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res , next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; 
  next();
});

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
      email: "student@gmail.com",
      username: "delta-student",
  });

  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
});

// Use Routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/" , userRouter);

app.all("*",(req, res, next) => {
  next(new ExpressError(404, "Page not found !"))
})

app.use((err, req, res, next) => {
   let {statusCode=500 , message = "Something Went Wrong"} = err;
   res.status(statusCode).render("error.ejs" , {message});
  //  res.status(statusCode).send(message);
});

app.listen(8080 , () => {
    console.log("Server is running at PORT 8080");
});