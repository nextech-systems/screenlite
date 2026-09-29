/*
  Warnings:

  - You are about to drop the column `createdAt` on the `UserPreferences` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserPreferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserPreferences" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "Dashboard" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "addedById" TEXT,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Dashboard_workspaceId_idx" ON "Dashboard"("workspaceId");

-- CreateIndex
CREATE INDEX "Dashboard_addedById_idx" ON "Dashboard"("addedById");

-- CreateIndex
CREATE INDEX "Dashboard_deletedAt_idx" ON "Dashboard"("deletedAt");

-- CreateIndex
CREATE INDEX "Dashboard_name_idx" ON "Dashboard"("name");

-- CreateIndex
CREATE INDEX "PlaylistScreen_playlistId_idx" ON "PlaylistScreen"("playlistId");

-- CreateIndex
CREATE INDEX "PlaylistScreen_screenId_idx" ON "PlaylistScreen"("screenId");

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
