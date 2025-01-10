import DanceClass from "../models/danceClass.model.js";

// @desc:  create dance class
// @route: POST /api/v1/dance-classes
const createDanceClass = async (req, res) => {
  try {
    const {
      classType,
      classDate,
      timeFrom,
      timeTo,
      venue,
      description,
      ticketPrice,
      ticketQuantity,
    } = req.body;

    if (
      !classType ||
      !classDate ||
      !timeFrom ||
      !timeTo ||
      !venue ||
      !description ||
      !ticketPrice ||
      !ticketQuantity
    ) {
      return res
        .status(400)
        .json({ status: 400, message: "all fields are required" });
    }

    const newDanceClass = new DanceClass({
      classType,
      classDate,
      timeFrom,
      timeTo,
      venue,
      description,
      ticketPrice,
      ticketQuantity,
    });
    const savedDanceClass = await newDanceClass.save();
    res.status(201).json({
      status: 201,
      message: "dance class created successfully",
      data: savedDanceClass,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  get specific dance class
// @route: POST /api/v1/dance-classes/:id
const getSpecificDanceClass = async (req, res) => {
  try {
    const id = req.params.id;
    const specificDanceClass = await DanceClass.findById({ _id: id }).select({
      __v: 0,
    });

    return res.status(200).json({
      status: 200,
      data: specificDanceClass,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

// @desc:  get specific dance class
// @route: POST /api/v1/dance-classes/
const getAllDanceClasses = async (req, res) => {
  try {
    const danceClasses = await DanceClass.find().select({
      __v: 0,
    });

    return res.status(200).json({
      status: 200,
      data: danceClasses,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

// @desc:  update dance class by id
// @route: PUT /api/v1/dance-classes/:id
const updateDanceClass = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      classType,
      classDate,
      timeFrom,
      timeTo,
      venue,
      description,
      ticketPrice,
      ticketQuantity,
    } = req.body;

    if (
      !classType &&
      !classDate &&
      !timeFrom &&
      !timeTo &&
      !venue &&
      !description &&
      !ticketPrice &&
      !ticketQuantity
    ) {
      return res.status(400).json({
        status: 400,
        message: "at least one field is required to update",
      });
    }

    const updatedDanceClass = await DanceClass.findByIdAndUpdate(
      id,
      {
        ...(classType && { classType }),
        ...(classDate && { classDate }),
        ...(timeFrom && { timeFrom }),
        ...(timeTo && { timeTo }),
        ...(venue && { venue }),
        ...(description && { description }),
        ...(ticketPrice && { ticketPrice }),
        ...(ticketQuantity && { ticketQuantity }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedDanceClass) {
      return res
        .status(404)
        .json({ status: 404, message: "dance class not found" });
    }

    return res.status(200).json({
      status: 200,
      message: "dance class updated successfully",
      data: updatedDanceClass,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "internal server error",
      data: error.message,
    });
  }
};

// @desc:  delete dance class by id
// @route: DELETE /api/v1/dance-classes/:id
const deleteDanceClass = async (req, res) => {
  try {
    const { id } = req.params;
    const danceClass = await DanceClass.findById({ _id: id });
    if (!danceClass) {
      return res
        .status(404)
        .json({ status: 404, message: "dance class not found" });
    }
    await DanceClass.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ status: 200, message: "dance class deleted" });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "internal server error",
      data: error.message,
    });
  }
};

export {
  createDanceClass,
  getSpecificDanceClass,
  getAllDanceClasses,
  updateDanceClass,
  deleteDanceClass,
};
