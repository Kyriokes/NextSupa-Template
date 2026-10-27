CREATE TABLE "theme_palettes" (
	"mode" text PRIMARY KEY NOT NULL,
	"colors" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" uuid,
	CONSTRAINT "theme_palettes_mode_valid" CHECK ("theme_palettes"."mode" in ('light', 'dark'))
);
--> statement-breakpoint
ALTER TABLE "theme_palettes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contact_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_pages" (
	"slug" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_by" uuid,
	CONSTRAINT "site_pages_slug_valid" CHECK ("site_pages"."slug" in ('faq', 'about', 'terms'))
);
--> statement-breakpoint
ALTER TABLE "site_pages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"photo_url" text,
	"roles" text[] DEFAULT '{user}'::text[] NOT NULL,
	"admin_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_roles_valid" CHECK ("users"."roles" <@ array['admin','user']::text[])
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "theme_palettes" ADD CONSTRAINT "theme_palettes_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_pages" ADD CONSTRAINT "site_pages_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "contact_messages_created_idx" ON "contact_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "contact_messages_email_idx" ON "contact_messages" USING btree ("email","created_at");--> statement-breakpoint
CREATE INDEX "contact_messages_user_idx" ON "contact_messages" USING btree ("user_id","created_at");