const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();
require("../db/conn");
const User = require("../models/userSchema");
const authenticate = require("../middleware/authenticate");

router.get("/", (req, res) => {
  res.send("hello world from home");
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, phonenumber, gender, age, password, confirmpassword } = req.body;

    if (!name || !email || !phonenumber || !gender || !age || !password || !confirmpassword) {
      return res.status(400).json({ error: 'All fields are required.' });
    } else if (password !== confirmpassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }

    const user = new User({
      name, email, phonenumber, gender, age, password, confirmpassword,
    });

    const userRegister = await user.save();

    if (userRegister) {
      res.status(201).json({ message: 'Registration successful.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ error: "Fields cannot be empty" });
    }

    const user = await User.findOne({ email: email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const token = await user.generateToken();
        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 100000),
          httpOnly: true,
        });
        res.json({ message: "success", user: user });
      } else {
        res.status(400).json({ error: "Incorrect Password" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// router.get("/getData", authenticate, (req, res) => {
//   res.send(req.rootUser);
// });

router.get("/logout", (req, res) => {
  res.clearCookie("jwt", { path: "/" });
  res.status(200).json("User logged out");
});

module.exports = router;
