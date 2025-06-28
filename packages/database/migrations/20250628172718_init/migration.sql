-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateTable
CREATE TABLE "nodes" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_folder" BOOLEAN NOT NULL DEFAULT false,
    "path" TEXT NOT NULL,
    "content" TEXT,

    CONSTRAINT "nodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nodes_path_key" ON "nodes"("path");
