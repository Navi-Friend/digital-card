/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "company_name_key" ON "company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "profile_name_key" ON "profile"("name");

-- CreateIndex
CREATE UNIQUE INDEX "project_name_key" ON "project"("name");
