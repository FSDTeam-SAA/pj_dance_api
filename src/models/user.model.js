import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import { jwtExpires, jwtSecret } from "../config/index.js";

const userSchema = new Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "admin",
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

// generate token
userSchema.methods.generateToken = async function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    jwtSecret,
    { expiresIn: jwtExpires }
  );
};

const User = mongoose.model("User", userSchema);

export default User;
