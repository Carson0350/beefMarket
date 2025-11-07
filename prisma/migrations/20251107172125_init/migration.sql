-- CreateEnum
CREATE TYPE "Role" AS ENUM ('RANCH_OWNER', 'BREEDER', 'ADMIN');

-- CreateEnum
CREATE TYPE "BullStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('UNREAD', 'RESPONDED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'BREEDER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ranch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "about" TEXT,
    "websiteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ranch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bull" (
    "id" TEXT NOT NULL,
    "ranchId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "BullStatus" NOT NULL DEFAULT 'DRAFT',
    "name" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "breed" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "heroImage" TEXT NOT NULL,
    "additionalImages" TEXT[],
    "epdData" JSONB,
    "geneticMarkers" TEXT,
    "dnaTestResults" TEXT,
    "sireName" TEXT,
    "damName" TEXT,
    "notableAncestors" TEXT[],
    "birthWeight" DOUBLE PRECISION,
    "weaningWeight" DOUBLE PRECISION,
    "yearlingWeight" DOUBLE PRECISION,
    "progenyNotes" TEXT,
    "availableStraws" INTEGER NOT NULL DEFAULT 0,
    "pricePerStraw" DOUBLE PRECISION,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bull_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "bullId" TEXT NOT NULL,
    "ranchId" TEXT NOT NULL,
    "breederName" TEXT NOT NULL,
    "breederEmail" TEXT NOT NULL,
    "breederPhone" TEXT,
    "message" TEXT NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'UNREAD',
    "internalNotes" TEXT,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bullId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Ranch_userId_key" ON "Ranch"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Ranch_slug_key" ON "Ranch"("slug");

-- CreateIndex
CREATE INDEX "Ranch_slug_idx" ON "Ranch"("slug");

-- CreateIndex
CREATE INDEX "Ranch_userId_idx" ON "Ranch"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Bull_slug_key" ON "Bull"("slug");

-- CreateIndex
CREATE INDEX "Bull_ranchId_idx" ON "Bull"("ranchId");

-- CreateIndex
CREATE INDEX "Bull_breed_idx" ON "Bull"("breed");

-- CreateIndex
CREATE INDEX "Bull_status_idx" ON "Bull"("status");

-- CreateIndex
CREATE INDEX "Bull_slug_idx" ON "Bull"("slug");

-- CreateIndex
CREATE INDEX "Bull_archived_idx" ON "Bull"("archived");

-- CreateIndex
CREATE INDEX "Inquiry_ranchId_idx" ON "Inquiry"("ranchId");

-- CreateIndex
CREATE INDEX "Inquiry_bullId_idx" ON "Inquiry"("bullId");

-- CreateIndex
CREATE INDEX "Inquiry_status_idx" ON "Inquiry"("status");

-- CreateIndex
CREATE INDEX "Inquiry_createdAt_idx" ON "Inquiry"("createdAt");

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Favorite_bullId_idx" ON "Favorite"("bullId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_bullId_key" ON "Favorite"("userId", "bullId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Ranch" ADD CONSTRAINT "Ranch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bull" ADD CONSTRAINT "Bull_ranchId_fkey" FOREIGN KEY ("ranchId") REFERENCES "Ranch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_bullId_fkey" FOREIGN KEY ("bullId") REFERENCES "Bull"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_ranchId_fkey" FOREIGN KEY ("ranchId") REFERENCES "Ranch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_bullId_fkey" FOREIGN KEY ("bullId") REFERENCES "Bull"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
