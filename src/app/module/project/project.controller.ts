import type { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync.js";
import { BadRequestError } from "../../utils/errorFormats.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { AddProjectMemberSchema, GetAllProjectsOptionsSchema } from "./project.schema.js";
import projectService from "./project.service.js";

const createProject = catchAsync(async (req: Request, res: Response) => {
	const { name, teamId } = req.body;

	const project = await projectService.createProject(name, teamId);

	sendResponse(res, {
		success: true,
		message: "Project created successfully",
		statusCode: status.CREATED,
		data: {
			project,
		},
	});
});

const addMemberToProject = catchAsync(
	async (req: Request, res: Response) => {
		const { projectId } = req.params;

		const validMemberData = AddProjectMemberSchema.safeParse({
			...req.body,
			projectId,
		});

		if (!validMemberData.success) {
			throw new BadRequestError(
				validMemberData.error.issues
					.map((issue) => issue.message)
					.join(" | "),
			);
		}

		const member = await projectService.addMemberToProject(
			validMemberData.data.projectId,
			validMemberData.data.userId,
			validMemberData.data.role,
		);

		sendResponse(res, {
			success: true,
			message: "Member added to project successfully",
			statusCode: status.CREATED,
			data: {
				member,
			},
		});
	},
);

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
	
	const options = GetAllProjectsOptionsSchema.safeParse(req.query);
	if (!options.success) {
		const errMessage = options.error.issues.map(issue => issue.message).join(" | ");
		throw new BadRequestError(errMessage);
	}

	const projects = await projectService.getAllProjects(options.data);

	sendResponse(res, {
		success: true,
		message: "Retrived all projects successfully",
		statusCode: status.CREATED,
		data: {
			projects,
		},
	});
});

const projectController = {
	createProject,
	addMemberToProject,
	getAllProjects,
};

export default projectController;