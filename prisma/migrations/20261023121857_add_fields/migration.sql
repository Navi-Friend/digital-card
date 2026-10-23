/*
  Warnings:

  - Added the required column `start` to the `experience` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "experience" ADD COLUMN     "achievements" TEXT[],
ADD COLUMN     "end" TIMESTAMP(3),
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "project" ADD COLUMN     "links" TEXT[];

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "skills" TEXT[];
