import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

// Middleware

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// EJS
app.set("view engine", "ejs");
app.use(express.static("public"));

// Client
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/profile", (req, res) => {
  res.render("profile");
});

// Routes
app.use("/api/v1/user", userRoutes);

// Test Server
app.get("/ping", (req, res) => {
  res.send("pong");
});

//Non-existent URL..........
app.all("*", (req, res) => {
  res.status(404).send("OOPS!! 404 Page Not Found.....");
});

// EXPORT APP
export default app;
