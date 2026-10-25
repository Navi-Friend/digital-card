/*
  Convert the project links array to the single public project link required
  by the GraphQL API. Existing rows keep their first link.
*/
ALTER TABLE "project" RENAME COLUMN "links" TO "link";
ALTER TABLE "project"
ALTER COLUMN "link" TYPE TEXT
USING COALESCE("link"[1], '');
ALTER TABLE "project"
ALTER COLUMN "link" SET NOT NULL;
