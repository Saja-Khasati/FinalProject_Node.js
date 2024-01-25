import { Router } from "express";
import * as bookingController from "./booking.controller.js";
import { auth } from "../../middleware/Auth.js";
import { asyncHandler } from "../../services/errorHandling.js";
import { endPoint } from "./booking.endPoint.js";

const router = Router();
router.get(
  "/paticularUser",
  auth(endPoint.get),
  asyncHandler(bookingController.getParticulerUser)
);
router.post(
  "/create",
  auth(endPoint.create),
  asyncHandler(bookingController.createBooking)
);
router.get(
  "/confirmBooking/:tokenEmail",
  asyncHandler(bookingController.confirmBooking)
);
router.delete(
  "/remove/:id",
  auth(endPoint.remove),
  asyncHandler(bookingController.removeBooking)
);
router.get("/getBooking",auth(endPoint.get),asyncHandler(bookingController.getAllBooking))

export default router;
