import { Router } from "express";
import { auth } from "../../middlewares/authentication.js";
import { validation } from "../../middlewares/validation.js";
import { myMulter, validationObject } from "../../services/multer.js";
import { asyncHandler } from "../../utils/ErrorHandling.js";

const router = Router();
import * as userController from "./user.controller.js";
import { loginValidation, signUpValidatinon } from "./user.validation.js";

router.post(
  "/",
  validation(signUpValidatinon),
  asyncHandler(userController.signUp)
);

router.post("/signIn", validation(loginValidation), userController.login);
router.get("/confirmEmail/:token", asyncHandler(userController.confirmEmail));
router.get("/refresh/:email", asyncHandler(userController.refreshToken));
router.get("/forget", asyncHandler(userController.forgetPass));
router.post("/reset/:token", asyncHandler(userController.resetPassword));
router.patch(
  "/profile",
  auth(),
  myMulter({}).single(),
  asyncHandler(userController.profilePic)
);

router.post("/logout", auth(), asyncHandler(userController.logOut));
export default router;
