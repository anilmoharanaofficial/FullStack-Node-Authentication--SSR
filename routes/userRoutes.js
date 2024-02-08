import { Router } from "express";
import { getProfile, login, register } from "../controllers/userController.js";
import isLoggedIn from "../Middleware/authoMiddleware.js";

const userRoutes = Router();

// User Routes
userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/profile", isLoggedIn, getProfile);

export default userRoutes;
