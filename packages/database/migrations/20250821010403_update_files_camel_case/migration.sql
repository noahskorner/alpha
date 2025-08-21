/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."File";

-- CreateTable
CREATE TABLE "public"."file" (
    "id" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "name" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);
