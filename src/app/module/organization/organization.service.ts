import {
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from "../../utils/errorFormats.js";
import type { ICreateOrganization } from "./organization.interface.js";
import { orgRepo } from "./organization.repository.js";

const createOrganization = async (
	payload: ICreateOrganization,
	userId: string,
) => {
	const organization = await orgRepo.createOrganization(payload, userId);

	return organization;
};

const getUsersAllOrg = async (userId: string) => {
	const organizations = await orgRepo.getUsersAllOrg(userId);

	return organizations;
};

const getOrganizationMembers = async (
	organizationId: string,
	requestingUserId: string,
) => {
	const organization = await orgRepo.getOrganizationById(organizationId);
	if (!organization) {
		throw new NotFoundError("organization not found");
	}

	const requestingMember = await orgRepo.getOrgMemberByUserandOrgId(
		organizationId,
		requestingUserId,
	);
	if (!requestingMember) {
		throw new ForbiddenError("you are not a member of this organization");
	}

	return orgRepo.getOrganizationMembers(organizationId);
};

const addMemberToOrganization = async (
	organizationId: string,
	identity: { userId: string } | { email: string },
) => {
	const organization = await orgRepo.getOrganizationById(organizationId);
	if (!organization) {
		throw new NotFoundError("organization not found");
	}

	const user =
		"email" in identity
			? await orgRepo.getUserByEmail(identity.email)
			: await orgRepo.getUserById(identity.userId);
	if (!user) {
		throw new NotFoundError("user not found");
	}

	const member = await orgRepo.getOrgMemberByUserandOrgId(
		organization.id,
		user.id,
	);
	if (member) {
		throw new BadRequestError("user already a member");
	}

	const newMember = await orgRepo.createOrganizationMember(
		organization.id,
		user.id,
	);

	return newMember;
};

export const organizationService = {
	createOrganization,
	getUsersAllOrg,
	getOrganizationMembers,
	addMemberToOrganization,
};
