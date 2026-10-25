/*
  Projects belong directly to a profile. Companies are related to experiences
  only, so remove the obsolete project-company foreign key and column.
*/
ALTER TABLE "project" DROP CONSTRAINT "project_company_id_fkey";
ALTER TABLE "project" DROP COLUMN "company_id";
