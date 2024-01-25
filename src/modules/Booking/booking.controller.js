import bookingModel from "../../../DB/models/booking.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../services/sendEmail.js";
import { pagination } from "../../middleware/Pagination.js";
import userModel from "../../../DB/models/user.model.js";

//getting paticular user booking data
export const getParticulerUser = async (req, res, next) => {
  let userId = req.body.userId;

  const reqData = await bookingModel.find({ userId });
  if (reqData) {
    return res
      .status(200)
      .json({ message: `All booking data of userId ${userId}`, reqData });
  }
  {
    return next(new Error("user not found"));
  }
};
//--------------------------------------------------------------------------------------------
//create new booking
export const createBooking = async (req, res, next) => {
  const { doctorId, userEmail, bookingDate, bookingSlot, bookingTime } =
    req.body;
  const doctor = await userModel.findById(doctorId);

  if (!doctor || doctor.role !== "Doctor") {
    return next(new Error("Doctor not found", { cause: 404 }));
  }

  let allBookings = await bookingModel.find({ doctorId });

  if (allBookings.length === 0) {
    const addData = await bookingModel.create({
      userId: req.user._id,
      doctorId,
      userEmail,
      bookingDate,
      bookingSlot,
      bookingTime,
    });

    await addData.save();
  } else {
    for (let i = 0; i < allBookings.length; i++) {
      if (
        allBookings[i].bookingDate === bookingDate &&
        allBookings[i].bookingSlot === bookingSlot
      ) {
        return next(new Error("This Slot is Not Available.", { cause: 404 }));
      }
    }
    const addData = await bookingModel.create({
      userId: req.user._id,
      doctorId,
      userEmail,
      bookingDate,
      bookingSlot,
      bookingTime,
    });

    await addData.save();
  }

  const tokenEmail = jwt.sign({ userEmail }, process.env.CONFIRMEMAIL);
  const html = `<a href='${req.protocol}://${req.headers.host}/booking/confirmBooking/${tokenEmail}'>CONFIRM YOUR Booking</a>`;
  sendEmail(userEmail, "Booking Confirmation from Rapid fit", html);
  return res.status(200).json({ message: "success" });
};
//---------------------------------------------------------------------------------------
export const confirmBooking = async (req, res, next) => {
  const tokenEmail = req.params.tokenEmail;
  const decoded = jwt.verify(tokenEmail, process.env.CONFIRMEMAIL);
  if (!decoded) {
    return next(new Error("Invalid token", { cause: 404 }));
  }
  const user = await bookingModel.findOne({ userEmail: decoded.userEmail });
  if (!user) {
    return next(
      new Error("Invalid verify your booking", {
        cause: 400,
      })
    );
  }
  return res.status(200).json({ message: " your booking is verified" });
};
//---------------------------------------------------------------------------------
//removing the booking data
export const removeBooking = async (req, res, next) => {
  const ID = req.params.id;
  let reqData = await bookingModel.find({ _id: ID });
  let specificDate = new Date(`${reqData[0].bookingDate}`);
  let currentDate = new Date();
  if (currentDate > specificDate) {
    return res.json({ msg: "Meeting Already Over" });
  } else {
    let timeDiff = Math.abs(currentDate.getTime() - specificDate.getTime());
    let daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (daysDiff >= 1) {
      const remove = await bookingModel.findByIdAndDelete({ _id: ID });
      return res.status(200).json({
        message: `booking id of ${ID} is deleted succesfully`,
        remove,
      });
    } else {
      return res.json({
        message:
          "Our cancellation policy requires a minimum one-day notice for booking deletions.",
      });
    }
  }
  //----------------------------------------------------------------
};
//--------------------------------------------------------------------------------------------
//get All booking data
export const getAllBooking = async (req, res, next) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);
  let queryObj = { ...req.query };
  const execQuery = ["page", "limit", "skip", "sort"];
  execQuery.map((ele) => {
    delete queryObj[ele];
  });
  queryObj = JSON.stringify(queryObj);
  queryObj = queryObj.replace(
    /\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g,
    (match) => `$${match}`
  );
  queryObj = JSON.parse(queryObj);

  const mongooseQuery = bookingModel.find(queryObj).limit(limit).skip(skip);
  const booking = await mongooseQuery.sort(req.query.sort?.replaceAll(",", ""));
  const count = await bookingModel.estimatedDocumentCount();

  return res.status(201).json({
    message: "success",
    count: booking.length,
    total: count,
    page: booking.length,
    booking,
  });
};
//----------------------------------------------------------------
