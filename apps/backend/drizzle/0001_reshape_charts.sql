-- Reshape `charts` to one row per birth profile.
--
-- The table was first designed to hold one row per (profile, system), from an
-- earlier assumption that each tradition would be computed independently. The
-- engine assembles all ten systems and the cross-system synthesis in a single
-- pass over one astronomical basis, so per-system rows would allow a profile to
-- hold a Vedic section computed under one engine version beside a Western
-- section computed under another.
--
-- Safe as a drop-and-recreate: no chart rows exist, and none can, because
-- nothing has ever written to this table.

DROP TABLE IF EXISTS "charts";

CREATE TABLE "charts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"birth_profile_id" uuid NOT NULL,
	"data" jsonb NOT NULL,
	"house_system" varchar(16) NOT NULL,
	"engine_version" varchar(32) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "charts_birth_profile_id_unique" UNIQUE("birth_profile_id")
);

ALTER TABLE "charts" ADD CONSTRAINT "charts_birth_profile_id_birth_profiles_id_fk"
	FOREIGN KEY ("birth_profile_id") REFERENCES "public"."birth_profiles"("id")
	ON DELETE cascade ON UPDATE no action;

CREATE INDEX "charts_profile_idx" ON "charts" USING btree ("birth_profile_id");
