ALTER TABLE "activity" ALTER COLUMN "id" SET DEFAULT 'ca42a073-b230-4f43-ba8d-a153feed5b21';--> statement-breakpoint
ALTER TABLE "activity" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "goal" ALTER COLUMN "id" SET DEFAULT 'a1d30d3d-54f7-4ab4-8ac0-c02fef9537fd';--> statement-breakpoint
ALTER TABLE "milestone" ALTER COLUMN "id" SET DEFAULT 'c58ab478-88f5-4405-a46b-79ceab5547ee';--> statement-breakpoint
ALTER TABLE "milestone" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "goal" ADD COLUMN "userId" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal" ADD CONSTRAINT "goal_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
