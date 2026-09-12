-- CreateEnum
CREATE TYPE "PaymentGatewayEnvironment" AS ENUM ('SANDBOX', 'PRODUCTION');

-- CreateTable
CREATE TABLE "BkashToken" (
    "id" UUID NOT NULL,
    "environment" "PaymentGatewayEnvironment" NOT NULL DEFAULT 'SANDBOX',
    "idToken" TEXT NOT NULL,
    "idTokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "refreshTokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BkashToken_pkey" PRIMARY KEY ("id")
);
