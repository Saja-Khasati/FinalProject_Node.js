import { Router } from "express";
import * as UserController from "./user.controller.js";
import { auth } from "../../middleware/Auth.js";
import { asyncHandler } from "../../services/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./user.validation.js";
import { endPoint } from "./user.endPoint.js";

const router = Router();
router.get(
  "/getDoctors",
  auth(endPoint.get),
  asyncHandler(UserController.getDoctors)
);
router.get(
  "/getSpecificDoctor/:id",
  auth(endPoint.getSpecific),
  asyncHandler(UserController.getSpecificDoctor)
);
router.get(
  "/getPatients",
  auth(endPoint.getPatient),
  asyncHandler(UserController.getPatients)
);
router.get(
  "/getSpecificPatient/:id",
  auth(endPoint.getPatient),
  asyncHandler(UserController.getSpecificPatient)
);
router.patch(
  "/softDelete/:id",
  auth(endPoint.delete),
  asyncHandler(UserController.softDelete)
);
router.delete(
  "/hardDelete/:id",
  auth(endPoint.delete),
  asyncHandler(UserController.hardDelete)
);
router.patch("/restore/:id", auth(endPoint.delete), UserController.restore);
router.patch(
  "/updatePassword",
  auth(endPoint.update),
  validation(validators.updatePassword),
  asyncHandler(UserController.updatePassword)
);

export default router;
