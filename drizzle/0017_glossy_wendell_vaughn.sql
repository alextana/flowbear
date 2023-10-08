ALTER TABLE "activity" DROP CONSTRAINT "activity_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "activity" ALTER COLUMN "id" SET DEFAULT 'a497a012-623c-4930-b232-7e903f0b51b4';--> statement-breakpoint
ALTER TABLE "activity" ALTER COLUMN "userId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "goal" ALTER COLUMN "id" SET DEFAULT '3985cf10-fd52-4df4-93e4-e2e9503109e2';--> statement-breakpoint
ALTER TABLE "milestone" ALTER COLUMN "id" SET DEFAULT 'fc35a962-60c8-4a64-a471-2a58f7246218';