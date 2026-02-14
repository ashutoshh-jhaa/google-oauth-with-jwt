import express from "express";
import { configDotenv } from "dotenv";
configDotenv({ quiet: true });
import passport from "./auth/google.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cookieParser());
app.use(passport.initialize());

//home
app.get("/", (req, res) => {
  res.send(`<a href="/auth/google">Login with Google </a>`);
});

//initiate google oauth
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

//decides the flow if the authentication is successful or valid
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  (req, res) => {
    const payload = {
      id: req.user.id,
      name: req.user.displayName,
      email: req.user.email,
    };

    //create a token to send to the client
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    //send token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.redirect("/dashboard");
  },
);

//verify jwt tokens
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).send("Unauthorized, Please login again");

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode) => {
    if (err) return res.status(403).send("Forbidden");

    req.user = decode;
    next();
  });
};

app.get("/dashboard", authenticateJWT, (req, res) => {
  res.send(`Hello ${req.user?.name}`);
});

app.listen(PORT, "localhost", (err) => {
  err
    ? console.log(err)
    : console.log(`Server is listening on localhost:${PORT}`);
});
