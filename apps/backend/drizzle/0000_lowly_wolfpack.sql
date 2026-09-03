CREATE TABLE "birth_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"display_name" varchar(80) NOT NULL,
	"birth_date" varchar(10) NOT NULL,
	"birth_time" varchar(5),
	"place_name" varchar(200) NOT NULL,
	"country_code" varchar(2) NOT NULL,
	"timezone" varchar(64) NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"is_self" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "charts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"birth_profile_id" uuid NOT NULL,
	"system" varchar(32) NOT NULL,
	"data" jsonb NOT NULL,
	"provenance" jsonb NOT NULL,
	"engine_version" varchar(32) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(254) NOT NULL,
	"password_hash" text,
	"display_name" varchar(80) NOT NULL,
	"primary_birth_profile_id" uuid,
	"google_sub" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "birth_profiles" ADD CONSTRAINT "birth_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "charts" ADD CONSTRAINT "charts_birth_profile_id_birth_profiles_id_fk" FOREIGN KEY ("birth_profile_id") REFERENCES "public"."birth_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "birth_profiles_user_idx" ON "birth_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "charts_profile_system_unique" ON "charts" USING btree ("birth_profile_id","system");--> statement-breakpoint
CREATE INDEX "charts_profile_idx" ON "charts" USING btree ("birth_profile_id");--> statement-breakpoint
CREATE UNIQUE INDEX "refresh_tokens_hash_unique" ON "refresh_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "refresh_tokens_user_idx" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_google_sub_unique" ON "users" USING btree ("google_sub");