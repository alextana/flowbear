ALTER TABLE "goal" DROP CONSTRAINT "goal_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "activity" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "goal" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "milestone" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "milestone" ALTER COLUMN "userId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "activity" ADD COLUMN "goalId" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activity" ADD CONSTRAINT "activity_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activity" ADD CONSTRAINT "activity_goalId_goal_id_fk" FOREIGN KEY ("goalId") REFERENCES "goal"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "goal" DROP COLUMN IF EXISTS "userId";