#!/usr/bin/env bash
set -euo pipefail

###############################################################################
#  Full‑Stack Monorepo Scaffolder – 2025 Edition
#  Usage: ./setup.sh <project-name>
###############################################################################

PROJECT_NAME=${1:-my-monorepo}
NODE_LTS="22"                 # Adjust if a newer LTS ships – script is 2025‑06 ready

#--------------------------------------------------------------------
# 0️⃣  Pre‑flight checks
#--------------------------------------------------------------------
if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm is required but not installed. Install Node.js first." && exit 1
fi
if ! command -v docker >/dev/null 2>&1; then
  echo "❌ Docker is required for the local Postgres service." && exit 1
fi

#--------------------------------------------------------------------
# 1️⃣  Create root folder & initialise git / npm workspaces
#--------------------------------------------------------------------
mkdir -p "$PROJECT_NAME" && cd "$PROJECT_NAME"

echo "🌱 Initialising npm workspaces…"
npm init -y >/dev/null

# Workspaces & Turbo
node - <<'EOF'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.private = true;
pkg.workspaces = ["apps/*", "packages/*"];
pkg.scripts = {
  "dev": "turbo run dev",
  "build": "turbo run build",
  "lint": "turbo run lint"
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
EOF

echo "📦 Installing Turborepo CLI as dev dependency…"
npm install -D turbo@latest >/dev/null

cat > turbo.json <<'EOF'
{
  "$schema": "https://turborepo.org/schema.json",
  "pipeline": {
    "dev": { "cache": false, "dependsOn": ["^dev"], "outputs": [] },
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", "build/**"] },
    "lint": { "cache": true }
  }
}
EOF

#--------------------------------------------------------------------
# 2️⃣  Node version pinning
#--------------------------------------------------------------------
printf "%s\n" "$NODE_LTS" > .node-version

#--------------------------------------------------------------------
# 3️⃣  Scaffold directories
#--------------------------------------------------------------------
mkdir -p apps packages

#--------------------------------------------------------------------
# 4️⃣  Front‑end – Next.js 14 App Router (+Tailwind, +TypeScript, +ESLint)
#--------------------------------------------------------------------
APP_DIR="apps/next"

echo "⚡ Creating Next.js app in $APP_DIR…"

CI=1 npx create-next-app@latest "$APP_DIR" \
  --app \
  --typescript \
  --tailwind \
  --eslint \
  --package-manager npm \
  --no-src-dir \
  --import-alias "@/*" \
  --skip-install \
  --yes >/dev/null

# Install shadcn/ui & Scalar inside the Next.js workspace
pushd "$APP_DIR" >/dev/null

echo "🎨 Installing shadcn/ui + Scalar…"

npm install -D @scalar/cli@latest >/dev/null
npx --yes shadcn-ui@latest init --skip-install >/dev/null
npm install >/dev/null

# Add Scalar script to package.json
node - <<'EOF'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json'));
pkg.scripts["docs"] = "scalar generate --watch";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
EOF

popd >/dev/null

#--------------------------------------------------------------------
# 5️⃣  Backend – Prisma package
#--------------------------------------------------------------------
DB_DIR="packages/database"

echo "🗄️ Creating Prisma package in $DB_DIR…"
mkdir -p "$DB_DIR"
pushd "$DB_DIR" >/dev/null
npm init -y >/dev/null
npm install prisma@latest @prisma/client@latest >/dev/null

# Prisma schema with pgvector extension enabled
cat > schema.prisma <<'EOS'
// datasource & generator ------------------------------------------------------

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  extensions = [pgvector]
}

generator client {
  provider = "prisma-client-js"
}

// Example model ----------------------------------------------------------------

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
EOS

# Re‑export generated client types for downstream packages
mkdir -p src && cat > src/index.ts <<'EOS'
export * from "@prisma/client";
EOS

popd >/dev/null

#--------------------------------------------------------------------
# 6️⃣  Docker Compose for Postgres + pgvector
#--------------------------------------------------------------------
cat > docker-compose.yml <<'EOF'
version: "3.9"
services:
  db:
    image: ankane/pgvector:latest
    container_name: ${PROJECT_NAME}_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ${PROJECT_NAME}
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data
volumes:
  db-data:
EOF

#--------------------------------------------------------------------
# 7️⃣  Environment template
#--------------------------------------------------------------------
cat > .env.example <<'EOF'
# Root‑level env vars

# PostgreSQL (Docker service)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/${PROJECT_NAME}?schema=public"
EOF

#--------------------------------------------------------------------
# 8️⃣  Git ignore & first commit
#--------------------------------------------------------------------
cat > .gitignore <<'EOF'
# Node & Editor artefacts
node_modules
.pnpm-store
.env*

# Build outputs
/apps/**/.next
/apps/**/out
/packages/**/dist
/packages/**/build

# Docker volume
volumes/
EOF

git init >/dev/null

git add .
git commit -m "chore: initial scaffolding via setup.sh" >/dev/null || true

echo "✅  Monorepo scaffolding complete!  Run the following to start coding:"
echo "------------------------------------------------------------"
echo "cd $PROJECT_NAME"
echo "docker compose up -d            # Start Postgres + pgvector"
echo "npm run dev                     # Turbo will spin up everything"
echo "------------------------------------------------------------"