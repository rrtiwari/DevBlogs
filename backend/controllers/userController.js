const Users = require("../models/users");
const bcrypt = require("bcrypt");
const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const registerUser = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const { name, email, password } = req.body;
    const existing = await Users.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    // Default role is "user". You must change this to "admin" in MongoDB Compass manually.
    const user = new Users({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });
    await user.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });

    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    // --- PROFESSIONAL LOGIC ---
    
    req.session.userid = user._id;
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // <--- Direct from DB
    };

    res.json({ success: true, user: req.session.user });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.json({ success: true });
};

const checkSession = async (req, res) => {
  if (req.session.userid) {
    try {
      const user = await Users.findById(req.session.userid);
      if (!user) return res.json({ isAuthenticated: false });

      // Trust the DB on refresh too
      res.json({
        isAuthenticated: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      res.json({ isAuthenticated: false });
    }
  } else {
    res.json({ isAuthenticated: false });
  }
};

module.exports = { registerUser, login, logout, checkSession };
