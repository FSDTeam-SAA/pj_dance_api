import mongoose from "mongoose";
import { mongodbUri } from "../config/index.js";

const configDb = async () => {
  try {
    await mongoose.connect(mongodbUri);
    console.log("db connected...!");
  } catch (error) {
    console.log(error.message);
  }
};

export default configDb;
