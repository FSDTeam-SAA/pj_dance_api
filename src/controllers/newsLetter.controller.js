import DanceClass from "../models/danceClass.model.js";
import NewsLetter from "../models/newsLetter.model.js";
import PurchaseTicket from "../models/purchaseTicket.model.js";
import sendMail from "../utils/sendMail.js";

// @desc:  join newsletter
// @route: POST /api/v1/newsletters/join
const joinNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 400,
        message: "email is required",
      });
    }

    let newsletter = await NewsLetter.findOne({ email });
    if (newsletter) {
      return res.status(400).json({
        status: 400,
        messgae: "already subscribed",
      });
    }

    let subscribe = await NewsLetter.create({ email });
    return res.status(200).json({
      status: 200,
      message: "successfully subscribed to the newsletter",
      data: subscribe,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  get all subcribed email address
// @route: GET /api/v1/newsletters
const getAllSubscribedUsers = async (req, res) => {
  try {
    const subscribers = await NewsLetter.find({});
    return res.status(200).json({
      status: 200,
      message: "fetch all newsletter subscriber",
      data: subscribers,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  send newsletter
// @route: POST /api/v1/newsletters/send
const sendNewsLetter = async (req, res) => {
  try {
    const { sub, body } = req.body;
    const subscibedUsers = await NewsLetter.find({});
    const emails = subscibedUsers.map((user) => user.email);
    const emailString = emails.join(", ");
    sendMail(emailString, sub, body);
    return res.send("Email sent");
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  send dance class notification
// @route: POST /api/v1/newsletters/notification
const sendClassNotification = async (req, res) => {
  try {
    const { classType, classDate, sub, body } = req.body;
    if (!classType || !classDate) {
      return res
        .status(400)
        .json({ message: "classType and classDate are required" });
    }

    const danceClasses = await DanceClass.find({ classType, classDate });
    if (danceClasses.length === 0) {
      return res.status(404).json({
        message: "no dance classes found for the specified type and date",
      });
    }

    const danceClassIds = danceClasses.map((danceClass) => danceClass._id);

    const purchases = await PurchaseTicket.find({
      danceClass: { $in: danceClassIds },
    }).select("email");

    const emails = [...new Set(purchases.map((purchase) => purchase.email))];
    const emailString = emails.join(", ");
    sendMail(emailString, sub, body);
    return res
      .status(200)
      .json({ status: 200, message: "class notification sent" });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "internal server error",
      data: error.message,
    });
  }
};

export {
  joinNewsletter,
  getAllSubscribedUsers,
  sendNewsLetter,
  sendClassNotification,
};
