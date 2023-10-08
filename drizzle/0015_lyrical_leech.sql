CREATE TABLE IF NOT EXISTS "activity" (
	"id" text PRIMARY KEY DEFAULT '565a918a-1b25-4660-9347-fc1a81114d5d' NOT NULL,
	"description" text,
	"userId" text,
	"content" text NOT NULL,
	"goalId" text,
	"created_at" timestamp (6) with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal" (
	"id" text PRIMARY KEY DEFAULT 'a2ebb27e-c27d-483f-93cd-f344cb1e8c24' NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content" text,
	"milestoneId" text,
	"created_at" timestamp (6) with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "milestone" (
	"id" text PRIMARY KEY DEFAULT '3744b384-8bf7-4cf4-b8a9-abc502525acc' NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content" text,
	"userId" text,
	"created_at" timestamp (6) with time zone DEFAULT now()
);
--> statement-breakpoint
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
DO $$ BEGIN
 ALTER TABLE "goal" ADD CONSTRAINT "goal_milestoneId_milestone_id_fk" FOREIGN KEY ("milestoneId") REFERENCES "milestone"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "milestone" ADD CONSTRAINT "milestone_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
