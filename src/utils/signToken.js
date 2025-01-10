import User from "../models/user.model.js";

const signToken = async (id) => {
  try {
    const user = await User.findById({ _id: id });
    const token = await user.generateToken();
    user.token = token;
    await user.save();
    return { token };
  } catch (error) {
    console.log(error);
  }
};

export default signToken;
