import express from "express";
import { Request, Response } from "express";
import { prisma } from "./lib/prisma.js";

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

export default app;