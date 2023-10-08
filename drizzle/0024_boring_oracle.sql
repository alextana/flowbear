ALTER TABLE "goal" RENAME COLUMN "milestoneId" TO "userId";--> statement-breakpoint
ALTER TABLE "goal" DROP CONSTRAINT "goal_milestoneId_milestone_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal" ADD CONSTRAINT "goal_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
