import mongoose from "mongoose";

const newsLetterSchema = new mongoose.Schema({
  email: {
    type: String,
  },
});

const NewsLetter = mongoose.model("NewsLetter", newsLetterSchema);

export default NewsLetter;
