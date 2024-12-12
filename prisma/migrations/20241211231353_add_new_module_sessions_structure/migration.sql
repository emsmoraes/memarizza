/*
  Warnings:

  - You are about to drop the `_ModuleSessionModules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ModuleSessionModules" DROP CONSTRAINT "_ModuleSessionModules_A_fkey";

-- DropForeignKey
ALTER TABLE "_ModuleSessionModules" DROP CONSTRAINT "_ModuleSessionModules_B_fkey";

-- DropTable
DROP TABLE "_ModuleSessionModules";
