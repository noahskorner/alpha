# 🛠️ alpha – Full‑Stack Monorepo (2025 Edition)

Welcome to **alpha**, a modern Turborepo‑powered monorepo featuring Next.js 14, shadcn/ui, Prisma, and a Postgres (pgvector‑enabled) database. Built for rapid prototyping **and** production‑grade scaling.

---

## 📁 Project Structure

```
alpha
│  .node-version             # Node LTS pin
│  docker-compose.yml        # Postgres + pgvector service
│  turbo.json                # Turborepo pipeline
│  .env.example              # Environment template
│  setup.sh                  # Scaffolding script
│  README.md                 # You are here
├─ apps/
│   └─ next/                 # Next.js 14 App Router frontend
└─ packages/
└─ database/             # Prisma schema & generated client
```

---

## 🚀 Quick Start

```bash
# 1. Clone & install deps
$ git clone <repo-url> && cd $PROJECT_NAME
$ npm install

# 2. Spin up Postgres (pgvector)
$ docker compose up -d

# 3. Apply Prisma migrations & generate client
$ npx prisma migrate dev --name init
$ npx prisma generate

# 4. Start turbo dev pipeline (Next.js + prisma watches)
$ npm run dev
```

> **Tip:** Turborepo caches builds between runs. If things get weird, `rm -rf .turbo`.

---

## 📚 API Docs with Scalar

- Runs in **watch** mode via `npm run docs` **inside** `apps/next`.
- Open [http://localhost:5001](http://localhost:5001) (default) to browse the live OpenAPI UI.
- The OpenAPI spec lives at `apps/next/app/api/schema.yaml` – commit it.

---

## 🔄 Development Workflow

| Command (root)  | What it does                                            |
| --------------- | ------------------------------------------------------- |
| `npm run dev`   | Turbo runs `next dev` + watches Prisma & other packages |
| `npm run build` | Builds all apps & packages                              |
| `npm run lint`  | Runs ESLint across the monorepo                         |

### Adding Packages / Apps

```bash
# New package
$ turbo gen package my-lib                # or mkdir packages/my-lib

# New Next.js app
$ npx create-next-app apps/docs --app --no-src-dir --use-npm
```

Remember to update the **workspaces** array in `package.json` if you add paths outside `apps/*` or `packages/*`.

---

## 🤝 Contributing

1. Fork & clone
2. `npm install`
3. Follow **Quick Start** above
4. Create feature branch (`git checkout -b feat/my-thing`)
5. Commit granular, meaningful changes
6. Push & open a PR targeting **main**

### Troubleshooting Cheatsheet

| Symptom                 | Fix                                                      |
| ----------------------- | -------------------------------------------------------- |
| `prisma generate` fails | Ensure Postgres is running and `DATABASE_URL` is correct |
| Turbo shows stale cache | `npx turbo clean` (or delete `.turbo/`)                  |
| Next.js can’t reach DB  | Check Docker port/credentials & `.env` values            |
| Scalar UI empty         | Regenerate spec (`npm run docs` in `apps/next`)          |

---

## 📄 License

MIT © 2025
