import type { Request, Response } from "express";
import status from "http-status";
import type { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { organizationService } from "./organization.service.js";
import { BadRequestError } from "../../utils/errorFormats.js";
import { validateRequest } from "../../middleware/zodValidation.js";
import { AddMemberSchema } from "./organization.schema.js";

const createOrganization = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const {id} = req.user as JwtPayload;

    const organization = await organizationService.createOrganization(payload, id);

    sendResponse(res, {
        success: true,
        message: "Organization created successfully",
        statusCode: status.CREATED,
        data: {
            organization,
        }
    })
});

const getUserOrganizations = catchAsync(async (req: Request, res: Response) => {
    const {id} = req.user as JwtPayload;

    const organizations = await organizationService.getUsersAllOrg(id);
    
    sendResponse(res, {
        success: true,
        message: "get user's organizations successfully",
        statusCode: status.OK,
        data: {
            organizations,
        }
    })
});

const addMember = catchAsync(async (req: Request, res: Response) => {
    const organizationId = req.params.organizationId;
    const {userId} = req.body;

    const validIds = AddMemberSchema.safeParse({
        organizationId,
        ...req.body,
    });
    if (!validIds.success) {
        const errMessage = validIds.error.issues.map(issue => issue.message).join(" | ");
        throw new BadRequestError(errMessage);
    }

    if (typeof organizationId !== "string") {
        throw new BadRequestError("invalid organizationId in url");
    }

    const member = await organizationService.addMemberToOrganization(organizationId, userId);

    sendResponse(res, {
        success: true,
        message: "Member added successfully",
        statusCode: status.CREATED,
        data: {
            member,
        }
    });
});

export const organizationController = {
    createOrganization,
    getUserOrganizations,
    addMember,
}