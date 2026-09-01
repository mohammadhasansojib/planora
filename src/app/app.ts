import express, { NextFunction } from "express";
import { Request, Response } from "express";
import { prisma } from "./lib/prisma.js";
import { sendResponse } from "./utils/sendResponse.js";
import { AppError } from "./utils/errorFormats.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req: Request, res: Response) => {
    res.send("Server Running...");
});

app.get("/test-prisma", async (req: Request, res: Response) => {
    const test = await prisma.test.create({});

    res.json({
        data: test,
    })
});


// 404 route handler
app.use((req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
        success: false,
        message: "route not found",
        statusCode: 404,
        data: null,
    });
})

// global error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = "Internal Server Error";

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    sendResponse(res, {
        success: false,
        message,
        statusCode,
        data: null,
    });
})


export default app;