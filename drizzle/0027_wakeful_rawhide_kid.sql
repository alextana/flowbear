DROP TABLE "goal";--> statement-breakpoint
DROP TABLE "milestone";--> statement-breakpoint
ALTER TABLE "activity" DROP CONSTRAINT "activity_goalId_goal_id_fk";
--> statement-breakpoint
ALTER TABLE "activity" DROP COLUMN IF EXISTS "goalId";