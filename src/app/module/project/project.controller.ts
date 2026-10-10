import type { Request, Response } from "express";
import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync.js";
import { BadRequestError } from "../../utils/errorFormats.js";
import { sendResponse } from "../../utils/sendResponse.js";
import {
	AddProjectMemberSchema,
	GetAllProjectsOptionsSchema,
	GetProjectMembersSchema,
} from "./project.schema.js";
import projectService from "./project.service.js";

const createProject = catchAsync(async (req: Request, res: Response) => {
	const { name, teamId } = req.body;
	const { id: requestingUserId } = req.user as JwtPayload;

	const project = await projectService.createProject(
		name,
		teamId,
		requestingUserId,
	);

	sendResponse(res, {
		success: true,
		message: "Project created successfully",
		statusCode: status.CREATED,
		data: {
			project,
		},
	});
});

const addMemberToProject = catchAsync(async (req: Request, res: Response) => {
	const { projectId } = req.params;
	const { id: requestingUserId } = req.user as JwtPayload;

	const validMemberData = AddProjectMemberSchema.safeParse({
		...req.body,
		projectId,
	});

	if (!validMemberData.success) {
		throw new BadRequestError(
			validMemberData.error.issues.map((issue) => issue.message).join(" | "),
		);
	}

	const member = await projectService.addMemberToProject(
		validMemberData.data.projectId,
		validMemberData.data.userId,
		validMemberData.data.role,
		requestingUserId,
	);

	sendResponse(res, {
		success: true,
		message: "Member added to project successfully",
		statusCode: status.CREATED,
		data: {
			member,
		},
	});
});

const getProjectMembers = catchAsync(async (req: Request, res: Response) => {
	const { id: requestingUserId } = req.user as JwtPayload;
	const validProject = GetProjectMembersSchema.safeParse(req.params);
	if (!validProject.success) {
		throw new BadRequestError(
			validProject.error.issues.map((issue) => issue.message).join(" | "),
		);
	}

	const members = await projectService.getProjectMembers(
		validProject.data.projectId,
		requestingUserId,
	);

	sendResponse(res, {
		success: true,
		message: "Project members retrieved successfully",
		statusCode: status.OK,
		data: {
			members,
		},
	});
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
	const { id: requestingUserId } = req.user as JwtPayload;
	const options = GetAllProjectsOptionsSchema.safeParse(req.query);
	if (!options.success) {
		const errMessage = options.error.issues
			.map((issue) => issue.message)
			.join(" | ");
		throw new BadRequestError(errMessage);
	}

	const result = await projectService.getAllProjects(
		options.data,
		requestingUserId,
	);

	sendResponse(res, {
		success: true,
		message: "Retrieved all projects successfully",
		statusCode: status.OK,
		data: {
			...result,
		},
	});
});

const projectController = {
	createProject,
	addMemberToProject,
	getProjectMembers,
	getAllProjects,
};

export default projectController;
