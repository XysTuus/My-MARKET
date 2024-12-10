import { Router } from "express";
import {
  changeAccountPassword,
  createAccount,
  forgetAccountPassword,
  loginAccount,
  readAllAccounts,
  readOneAccount,
  verifyAccount,
} from "../controller/userController";
const router: any = Router();

router.route("/register").post(createAccount);
router.route("/login").post(loginAccount);
router.route("/verify-account/userID").get(verifyAccount);
router.route("/forgot-account-password").patch(forgetAccountPassword);
router.route("/reset-account-password").patch(changeAccountPassword);

router.route("/get-one-user/:userID").get(readOneAccount);
router.route("/get-all-users").get(readAllAccounts);

export default router;
