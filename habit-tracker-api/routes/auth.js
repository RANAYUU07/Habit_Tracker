import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";

const router = express.Router();

// since we are gonna register a user in the database it might take some time hence async
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ emailId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token, userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: "Signup Failed", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res
        .status(404)
        .json({ message: "User with the given email does not exist" });
    }

    // the password that i got in body and the password that is associated with the user we found from the email, we compare that
    const verifyPassword = await bcrypt.compare(password, findUser.password);
    if (!verifyPassword) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign({ emailId: findUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token, userId: findUser.id });
  } catch (error) {
    res.status(500).json({ message: "Login Failed", error: error.message });
  }
});

export default router;
