import userModel from "../../../DB/models/user.model.js";
import { pagination } from "../../middleware/Pagination.js";
import bcrypt from "bcryptjs";

export const getDoctors = async (req, res, next) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);
    const user = await userModel.find({ role: "Doctor" }).skip(skip).limit(limit);
  return res.json({ message: "All doctors", user });
};
//-----------------------------------------------------------------------------------------
export const getSpecificDoctor = async (req, res, next) => {
  const { id } = req.params;
  const doctor = await userModel.findById(id);
  if (!doctor) {
    return next(new Error("doctor not found", { cause: 404 }));
  }
  if (doctor.role == "Doctor") {
    return res.json({ message: "success", doctor });
  }
  return next(new Error("user not doctor", { cause: 404 }));
};
//-----------------------------------------------------------------------------------------
export const getPatients = async (req, res, next) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);
  const user = await userModel
    .find({ role: "Patient" })
    .skip(skip)
    .limit(limit);
  return res.json({ message: "All Patients", user });
};
//-----------------------------------------------------------------------------------------
export const getSpecificPatient = async (req, res, next) => {
  const { id } = req.params;
  const patient = await userModel.findById(id);
  if (!patient) {
    return next(new Error("patient not found", { cause: 404 }));
  }
  if (patient.role == "Patient") {
    return res.json({ message: "success", patient });
  }
  return next(new Error("user not patient", { cause: 404 }));
};
//-----------------------------------------------------------------------------------------
export const softDelete = async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
  if (user) {
    return res.status(200).json({ message: "success" });
  }
  return next(new Error("can't delete this user", { cause: 400 }));
};
//-----------------------------------------------------------------------------------------
export const hardDelete = async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findOneAndDelete({ _id: id });
  if (!user) {
    return next(new Error("can't delete this user", { cause: 400 }));
  }
  return res.status(200).json({ message: "success" });
};
//-----------------------------------------------------------------------------------------
export const restore = async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findOneAndUpdate(
    { _id: id, isDeleted: true },
    { isDeleted: false },
    { new: true }
  );
  if (!user) {
    return res.status(400).json({ message: "can't restore this user" });
  }
  return res.status(200).json({ message: "success" });
};
//-----------------------------------------------------------------------------------------
export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await userModel.findById(req.user._id);
  const match = bcrypt.compareSync(oldPassword, user.password); // مقارنة بين الباسوورد القديمة والباسوورد اللي في الداتا بيس

  if (!match) {
    return next(new Error("Invalid old password"));
  }
  const hashedPassword = bcrypt.hashSync(
    newPassword,
    parseInt(process.env.SALTROUND)
  );
  const updatePass = await userModel.updateOne({_id:req.user._id},{password:hashedPassword},{new:true});
  return res.status(200).json({ message: "success",updatePass});
};
//-----------------------------------------------------------------------------------------