import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";
import { prisma } from "./lib/prisma.js";
import authRouter from "./module/auth/auth.route.js";
import commentRouter from "./module/comment/comment.route.js";
import organizationRouter from "./module/organization/organization.route.js";
import paymentRouter from "./module/payment/payment.route.js";
import projectRouter from "./module/project/project.route.js";
import sprintRouter from "./module/sprint/sprint.route.js";
import taskRouter from "./module/task/task.route.js";
import teamRouter from "./module/team/team.route.js";
import { AppError } from "./utils/errorFormats.js";
import { sendResponse } from "./utils/sendResponse.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/organizations", organizationRouter);
app.use("/api/v1/teams", teamRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/sprints", sprintRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/payments", paymentRouter);

app.get("/", (_req: Request, res: Response) => {
	res.send("Server Running...");
});

app.get("/test-prisma", async (_req: Request, res: Response) => {
	const test = await prisma.test.create({});

	res.json({
		data: test,
	});
});

// 404 route handler
app.use((_req: Request, res: Response, _next: NextFunction) => {
	sendResponse(res, {
		success: false,
		message: "route not found",
		statusCode: 404,
		data: null,
	});
});

// global error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
	let statusCode = 500;
	let message = "Internal Server Error";

	if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;
	}
	console.log(err);

	sendResponse(res, {
		success: false,
		message,
		statusCode,
		data: null,
	});
});

export default app;
