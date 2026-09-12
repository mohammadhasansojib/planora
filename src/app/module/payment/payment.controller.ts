import type { Request, Response } from "express";
import status from "http-status";
import config from "../../config/index.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AuthorizationError } from "../../utils/errorFormats.js";
import { sendResponse } from "../../utils/sendResponse.js";
import paymentService from "./payment.service.js";


const createPayment = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AuthorizationError("user id not found");
    }

    const payment = await paymentService.createPayment(userId);

    sendResponse(res, {
        success: true,
        message: "Payment Created Successfully",
        statusCode: status.OK,
        data: {
            ...payment,
            userId,
        }
    })
});

const callbackPayment = catchAsync(async (req: Request, res: Response) => {
    const userId = req.query.userId;
    if (!userId || !(typeof userId === "string")) {
        throw new AuthorizationError("user id not found");
    }

    await paymentService.executePayment(req.query, userId);
    // const result = await paymentService.executePayment(req.query);

    res.redirect(`${config.BKASH_FRONTEND_REDIRECT_URL}`);

    // sendResponse(res, {
    //     success: true,
    //     message: "Payment executed successfully",
    //     statusCode: status.OK,
    //     data: {
    //         result,
    //     }
    // });
});



const paymentController = {
    createPayment,
    callbackPayment,
}
export default paymentController;