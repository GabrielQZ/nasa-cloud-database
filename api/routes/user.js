const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const isEmpty = require("../../utils/isEmpty");
const User = require("../../models/User");

// @route		POST api/users
// @desc		create new user account
// @access	public
router.post(
  "/",
  [
    check("email", "Email Required").not().isEmpty(),
    check("password", "Password Required").not().isEmpty(),
    check("username", "Username Required").not().isEmpty(),
    check("email", "Valid Email Required").isEmail(),
    check("email", "Email must contain at between 6 and 64 characters").isLength({min: 6, max: 64}),
    check("password", "Password must contain at between 6 and 100 characters").isLength({min: 6, max: 100}),
    check("username", "Username must contain at between 3 and 20 characters").isLength({min: 3, max: 20}),
  ],
  async (req, res) => {
    // console.log("hello");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userData = {
        username: req.body.username.toLowerCase(),
        email: req.body.email.toLowerCase(),
        password: req.body.password,
      };
      // console.log("1");
      // check for existing.
      const emailQuery = await User.findOne({ email: userData.email });
      if (!isEmpty(emailQuery)) {
        return res.status(400).json({
          errors: [
            {
              msg: "Email Already Registered",
              param: "email",
              location: "body",
            },
          ],
        });
      }
      const nameQuery = await User.findOne({ username: userData.username });
      if (!isEmpty(nameQuery)) {
        return res.status(400).json({
          errors: [
            {
              msg: "Email Already Registered",
              param: "email",
              location: "body",
            },
          ],
        });
      }
      //hash password
      userData.password = await bcrypt.hash(userData.password, 10);
      const newUser = await User.create(userData);
      const payload = {
        id: newUser._id,
        email: newUser.email,
      };
      const token = jwt.sign(payload, process.env.JWT_KEY, {});
      return res.json({ token });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: error.message });
    }
  }
);

// @route		PUT api/users
// @desc		login to account
// @access	public
router.put(
  "/",
  [
    check("password", "Password Required").not().isEmpty(),
    check("email", "Valid Email Required").isEmail(),
    check("email", "Email Required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.errors);
      return res.status(400).json(errors.array());
    }
    try {
      const user = await User.findOne({
        email: req.body.email.toLowerCase(),
      });
      if (isEmpty(user)) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }
      User.findByIdAndUpdate(user._id, { lastLogin: Date.now() });
      const payload = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      };
      const token = await jwt.sign(payload, process.env.SECRET_OR_KEY, {});
      return res.json({
        token,
        isAdmin: payload.isAdmin,
        profile: user.profileId,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
