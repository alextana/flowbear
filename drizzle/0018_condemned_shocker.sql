ALTER TABLE "activity" DROP CONSTRAINT "activity_goalId_goal_id_fk";
--> statement-breakpoint
ALTER TABLE "activity" ALTER COLUMN "id" SET DEFAULT 'c89fe99f-7a7d-4302-92d2-78dcb18cd912';--> statement-breakpoint
ALTER TABLE "goal" ALTER COLUMN "id" SET DEFAULT '00d4237b-6aa9-4c4a-9d67-04d9e1ea5e79';--> statement-breakpoint
ALTER TABLE "milestone" ALTER COLUMN "id" SET DEFAULT 'f33ef645-c364-443f-a404-d85d4dca1825';--> statement-breakpoint
ALTER TABLE "activity" DROP COLUMN IF EXISTS "goalId";