import type { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync.js";
import { BadRequestError } from "../../utils/errorFormats.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { AddTeamMemberSchema } from "./team.schema.js";
import teamService from "./team.service.js";

const createTeam = catchAsync(async (req: Request, res: Response) => {
	const { name, organizationId } = req.body;

	const team = await teamService.createTeam(name, organizationId);

	sendResponse(res, {
		success: true,
		message: "Team created successfully",
		statusCode: status.CREATED,
		data: {
			team,
		},
	});
});

const addMemberToTeam = catchAsync(async (req: Request, res: Response) => {
	const { teamId } = req.params;

	const validMemberData = AddTeamMemberSchema.safeParse({
		...req.body,
		teamId,
	});
	if (!validMemberData.success) {
		throw new BadRequestError(
			validMemberData.error.issues.map((issue) => issue.message).join(" | "),
		);
	}

	const member = await teamService.addMemberToTeam(
		validMemberData.data.teamId,
		validMemberData.data.userId,
		validMemberData.data.role,
	);

	sendResponse(res, {
		success: true,
		message: "Member added to team successfully",
		statusCode: status.CREATED,
		data: {
			member,
		},
	});
});

const teamController = {
	createTeam,
	addMemberToTeam,
};
export default teamController;
