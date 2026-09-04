-- Add `readings`: the plain-language translation of a chart.
--
-- A chart states its findings in the vocabulary of the traditions that produced
-- them — "Jupiter mahadasha", "Uttara Phalguni pada 1". Every one of those is
-- precise, and almost none of them mean anything to someone meeting them for
-- the first time. A reading closes that gap.
--
-- Stored rather than generated per request: a reading costs money to produce,
-- takes seconds rather than milliseconds, and its inputs never change — the
-- same chart yields the same brief forever.
--
-- Cascading from `charts` rather than from `birth_profiles` is the point of the
-- design. A chart is recomputed when the engine version or house system
-- changes, and a reading written against the old placements is then wrong.
-- Hanging it off the chart makes that staleness impossible to forget.

CREATE TABLE "readings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chart_id" uuid NOT NULL,
	"data" jsonb NOT NULL,
	"model" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "readings_chart_id_unique" UNIQUE("chart_id")
);

ALTER TABLE "readings" ADD CONSTRAINT "readings_chart_id_charts_id_fk"
	FOREIGN KEY ("chart_id") REFERENCES "public"."charts"("id")
	ON DELETE cascade ON UPDATE no action;

CREATE INDEX "readings_chart_idx" ON "readings" USING btree ("chart_id");
