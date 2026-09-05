import express from "express";
import { auth } from "../../middleware/auth.js";
import { validateRequest } from "../../middleware/zodValidation.js";
import { organizationController } from "./organization.controller.js";
import { CreateOrgSchema } from "./organization.schema.js";

const router = express.Router();

router.post(
	"/",
	auth(),
	validateRequest(CreateOrgSchema),
	organizationController.createOrganization,
);
router.get("/", auth(), organizationController.getUserOrganizations);

router.post(
	"/:organizationId/members",
	auth(),
	organizationController.addMember,
);

const organizationRouter = router;
export default organizationRouter;
