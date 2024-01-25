import mongoose, { Schema, model } from "mongoose";
const resultSchema = new Schema(
  {
    patientId: {
      type: String,
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    patientEmail: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      required: true,
    },
    description:{
        type:String,
        required:true,
    },

    Notes: {
      type: String,
      required: true,
    },
    examinationTime:{
        type: String,
        required:true
    },
    Date:{
        type: String,
        required:true,
    },
    Medicine:{
        type:String,
        required:true,
    }
  },
  {
    timestamps: false,
  }
);
const resultModel = mongoose.models.Result || model("results", resultSchema);
export default resultModel;
