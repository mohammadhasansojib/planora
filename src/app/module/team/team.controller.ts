import type { Request, Response } from "express";
import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync.js";
import { BadRequestError } from "../../utils/errorFormats.js";
import { sendResponse } from "../../utils/sendResponse.js";
import {
	AddTeamMemberSchema,
	GetAllTeamsOptionsSchema,
	GetTeamMembersSchema,
} from "./team.schema.js";
import teamService from "./team.service.js";

const createTeam = catchAsync(async (req: Request, res: Response) => {
	const { name, organizationId } = req.body;
	const { id: requestingUserId } = req.user as JwtPayload;

	const team = await teamService.createTeam(
		name,
		organizationId,
		requestingUserId,
	);

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
	const { id: requestingUserId } = req.user as JwtPayload;

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
		requestingUserId,
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

const getTeamMembers = catchAsync(async (req: Request, res: Response) => {
	const { id: requestingUserId } = req.user as JwtPayload;
	const validTeam = GetTeamMembersSchema.safeParse(req.params);
	if (!validTeam.success) {
		throw new BadRequestError(
			validTeam.error.issues.map((issue) => issue.message).join(" | "),
		);
	}

	const members = await teamService.getTeamMembers(
		validTeam.data.teamId,
		requestingUserId,
	);

	sendResponse(res, {
		success: true,
		message: "Team members retrieved successfully",
		statusCode: status.OK,
		data: {
			members,
		},
	});
});

const getAllTeams = catchAsync(async (req: Request, res: Response) => {
	const { id: requestingUserId } = req.user as JwtPayload;
	const options = GetAllTeamsOptionsSchema.safeParse(req.query);
	if (!options.success) {
		const errMessage = options.error.issues
			.map((issue) => issue.message)
			.join(" | ");
		throw new BadRequestError(errMessage);
	}

	const result = await teamService.getAllTeams(options.data, requestingUserId);

	sendResponse(res, {
		success: true,
		message: "Retrieved all teams successfully",
		statusCode: status.OK,
		data: result,
	});
});

const teamController = {
	createTeam,
	addMemberToTeam,
	getTeamMembers,
	getAllTeams,
};
export default teamController;
