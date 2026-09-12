import express from "express";
import getBkashIdToken from "../../lib/bkash.js";
import { auth } from "../../middleware/auth.js";
import paymentController from "./payment.controller.js";

const router = express.Router();

router.get("/test", async (_req, res) => {
    const idToken = await getBkashIdToken();

    res.json({idToken});
});

router.post("/create-payment", auth(), paymentController.createPayment);

router.get("/callback", paymentController.callbackPayment);

const paymentRouter = router;
export default paymentRouter;