/*
  Warnings:

  - You are about to drop the column `createdAt` on the `module_session_modules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "module_session_modules" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "module_sessions" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
