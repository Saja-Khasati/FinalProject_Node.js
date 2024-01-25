import resultModel from "../../../DB/models/result.model.js";
import userModel from "../../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../services/sendEmail.js";
import { pagination } from "../../middleware/Pagination.js";

export const addResult = async (req, res, next) => {
  const {
    patientId,
    doctorName,
    patientEmail,
    result,
    description,
    Notes,
    examinationTime,
    Date,
    Medicine,
  } = req.body;

  const checkDoctor = await userModel.findById(req.user._id);
  if (!checkDoctor) {
    return next(new Error("doctor not found", { cause: 404 }));
  }
  const checkPatient = await userModel.findById(patientId);
  if (!checkPatient) {
    return next(new Error("patient not found", { cause: 404 }));
  }
  const results = await resultModel.create({
    patientId,
    doctorName,
    patientEmail,
    result,
    description,
    Notes,
    examinationTime,
    Date,
    Medicine,
  });
  const tokenEmail = jwt.sign({ patientEmail }, process.env.CONFIRMEMAIL);
  const html = `<a href='${req.protocol}://${req.headers.host}/result/sendResult/${tokenEmail}'>YOUR RESULT</a>`;
  sendEmail(patientEmail, "check your result", html);

  return res.status(201).json({ message: "success", results });
};
//----------------------------------------------------------------------------
export const getResult = async (req, res, next) => {
  const { skip, limit } = pagination(req.query.page, req.query.limit);
  const ID = req.params.id;
  const results = await resultModel.findById(ID);
  if (!results) {
    return next(new Error("result not found", { cause: 404 }));
  }
  let queryObj= {...req.query};
  const execQuery = ['page','limit','skip','sort'];
  execQuery.map( (ele)=>{
    delete queryObj[ele];
  })
  queryObj = JSON.stringify(queryObj);
  queryObj = queryObj.replace(/\b(gt|gte|lt|lte|in|nin|eq|neq)\b/g,match => `$${match}`);
  queryObj = JSON.parse(queryObj);

  const mongooseQuery =  resultModel.find(queryObj).limit(limit).skip(skip);
  const getR = await mongooseQuery.sort(req.query.sort?.replaceAll(',',''));
  const count = await resultModel.estimatedDocumentCount();

  return res.status(201).json({ message: "success", count: getR.length ,total:count, page: getR.length , getR});
};

//-----------------------------------------------------------------------------
export const sendResult = async (req, res, next) => {
  const tokenEmail = req.params.tokenEmail;
  const decoded = jwt.verify(tokenEmail, process.env.CONFIRMEMAIL);
  if (!decoded) {
    return next(new Error("Invalid token", { cause: 404 }));
  }
  const user = await resultModel.findOne({
    patientEmail: decoded.patientEmail,
  });
  if (!user) {
    return next(
      new Error("Invalid recieve your result", {
        cause: 400,
      })
    );
  }
  return res.status(200).json({ message: " your result is arrive", user });
};
