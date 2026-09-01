import { Response } from "express"

export const sendResponse = (res: Response, responseObject: {
    success: boolean,
    message: string,
    statusCode: number,
    data: any,
}) => {
    const statusCode = responseObject.statusCode || 500;

    res.status(statusCode).json(responseObject);
}