const express = require("express");
const app = express();
require("dotenv").config();
const bodyparser = require("body-parser");
const passport = require('passport');
const session = require("express-session");
require('./passport-setup');

const PORT = process.env.PORT;

// bodyParser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());

// session
app.use(
    session({
      secret: "#google#secure",
      resave: false,
      saveUninitialized: true,
    })
  );

// view engine set
app.set("view engine", "ejs");

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] },)
);

// Google OAuth callback
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/failed' }),
    (req, res) => {
        res.redirect("/home");
    });

// page routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/home", (req, res) => {
    res.render("home", {name: req.user.displayName, email: req.user.emails[0].value, pic:req.user.photos[0].value});
})

app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send("Error during logout");
        }
        req.session = null;
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
})