-- CreateTable
CREATE TABLE "public"."File" (
    "id" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_on" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "name" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);
