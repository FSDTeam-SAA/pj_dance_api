import User from "../models/user.model.js";
import signToken from "../utils/signToken.js";

// @desc:  create admin
// @route: POST /api/v1/users/
const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.create({ email, password });
    return res
      .status(201)
      .json({ status: 201, message: "user created", data: user });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  login as admin
// @route: POST /api/v1/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: 400, message: "email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: 404, message: "user not found" });
    }
    console.log("user:", user);
    if (user.email != email || user.password != password) {
      return res
        .status(400)
        .json({ status: 400, message: "incorrect email and password" });
    }

    const { token } = await signToken(user._id);
    return res
      .status(200)
      .json({ status: 200, message: "login suucessful", data: token });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "internal server error",
      data: error.message,
    });
  }
};

export { createUser, loginUser };
