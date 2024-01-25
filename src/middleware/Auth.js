import jwt from "jsonwebtoken";
import userModel from "../../DB/models/user.model.js";
export const roles = {
  Doctor: "Doctor",
  Patient: "Patient",
};

export const auth = (accessRoles = []) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(process.env.BEARERKEY)) {
      return next(new Error("Invalid authorization", { cause: 400 }));
    }
    const token = authorization.split(process.env.BEARERKEY)[1];

    const decoded = jwt.verify(token, process.env.LOGINSECRET);

    if (!decoded) {
      return next(new Error("Invalid authorization", { cause: 400 }));
    }
    const user = await userModel.findById(decoded._id).select(" name role");
    if (!user) {
      return next(new Error("not registered user", { cause: 404 }));
    }

    const changePasswordTimeInSeconds = parseInt(
      user.changePasswordTime?.getTime() / 1000
    );
    const tokenIssuedAtInSeconds = decoded.iat;

    if (changePasswordTimeInSeconds > tokenIssuedAtInSeconds) {
      return next(new Error("expired token , plz login"), { cause: 400 });
    }
    if (!accessRoles.includes(user.role)) {
      return next(new Error("not auth user", { cause: 403 }));
    }
    req.user = user;
    next();
  };
};
