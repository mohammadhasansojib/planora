import type { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync.js";
import { BadRequestError } from "../../utils/errorFormats.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { AddProjectMemberSchema } from "./project.schema.js";
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

const projectController = {
	createProject,
	addMemberToProject,
};

export default projectController;