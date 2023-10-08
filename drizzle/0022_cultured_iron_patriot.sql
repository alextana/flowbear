CREATE TABLE IF NOT EXISTS "activity" (
	"id" serial NOT NULL,
	"description" text,
	"userId" text,
	"content" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal" (
	"id" serial NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content" text,
	"milestoneId" text,
	"userId" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "milestone" (
	"id" serial NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content" text,
	"userId" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal" ADD CONSTRAINT "goal_milestoneId_milestone_id_fk" FOREIGN KEY ("milestoneId") REFERENCES "milestone"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal" ADD CONSTRAINT "goal_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "milestone" ADD CONSTRAINT "milestone_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
