import mongoose, { Schema, model } from "mongoose";
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
    },

    address: {
      type: String,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    age: {
      type: Number,
    },
    dateOfBirth: {
      type: Date,
    },

    role: {
      type: String,
      enum: ["Doctor", "Patient"],
      required: true,
    },
    sendCode: {
      type: String,
      default: null,
    },
    changePasswordTime: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.models.User || model("users", userSchema);
export default userModel;
