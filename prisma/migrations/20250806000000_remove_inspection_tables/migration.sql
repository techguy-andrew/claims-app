-- Drop inspection-related audit logs first (due to foreign key constraints)
DELETE FROM "audit_logs" WHERE "inspectionId" IS NOT NULL;

-- Remove the inspectionId column from audit_logs
ALTER TABLE "audit_logs" DROP COLUMN IF EXISTS "inspectionId";

-- Drop the inspections table completely
DROP TABLE IF EXISTS "inspections";

-- Remove INSPECTOR role from enum (if exists)
-- Note: This might fail if there are users with INSPECTOR role
-- You may need to update users first if needed
BEGIN;
  -- Create new enum without INSPECTOR
  CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'SUPER_ADMIN');
  
  -- Update any existing INSPECTOR users to ADMIN (if any exist)
  UPDATE "users" SET "role" = 'ADMIN'::"Role_new" WHERE "role" = 'INSPECTOR';
  
  -- Change column type
  ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'ADMIN';
  
  -- Drop old enum and rename new one
  DROP TYPE "Role";
  ALTER TYPE "Role_new" RENAME TO "Role";
COMMIT;