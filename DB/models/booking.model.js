import mongoose, { Schema, model } from "mongoose";


const bookingSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    doctorId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: String,
      required: true,
    },

    bookingSlot: {
      type: String,
      required: true,
    },

    bookingTime:{
      type:String,
      required:true,
    }
  },
  {
    timestamps: true,
  }
);
const bookingModel = mongoose.models.Booking || model("bookings", bookingSchema);
export default bookingModel;
