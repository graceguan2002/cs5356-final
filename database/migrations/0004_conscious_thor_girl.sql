ALTER TABLE "posts" RENAME COLUMN "tag" TO "tags";--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "views" integer DEFAULT 0 NOT NULL;