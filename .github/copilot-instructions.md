Your task is to "onboard" this repository to Copilot coding agent by adding a .github/copilot-instructions.md file in the repository that contains information describing how a coding agent seeing it for the first time can work most efficiently.

You will do this task only one time per repository and doing a good job can SIGNIFICANTLY improve the quality of the agent's work, so take your time, think carefully, and search thoroughly before writing the instructions.

<Goals>
- Reduce the likelihood of a coding agent pull request getting rejected by the user due to
generating code that fails the continuous integration build, fails a validation pipeline, or
having misbehavior.
- Minimize bash command and build failures.
- Allow the agent to complete its task more quickly by minimizing the need for exploration using grep, find, str_replace_editor, and code search tools.
</Goals>

<Limitations>
- Instructions must be no longer than 2 pages.
- Instructions must not be task specific.
</Limitations>

<HighLevelDetails>
- This repository is for a AI document intelligence tool, focusing mainly on automatic pdf creating and processing.
- Turborepo
- Typescript 
- Next.js 14 app router
- Authentication via NextAuth.js (`apps/web/app/auth.ts`)
- Postgres w/ pgvector running in Docker (`docker-compose.yml`)
- Prisma ORM
    - Migration commands can be found in `packages/database/package.json`
- Shadcn UI components
- Zod request/response schema
    - OpenAPI integration generates `apps/web/app/api/openapi.json`
    - Scalar docs are then rendered at `apps/web/app/api/docs`
</HighLevelDetails>

<ProjectLayout>
alpha
│  .node-version                   # Node LTS pin
|  .github/copilot-instructions.md # Copilot instructions (you are here)
│  docker-compose.yml              # Postgres + pgvector service
│  turbo.json                      # Turborepo pipeline
│  .env.example                    # Environment template
│  setup.sh                        # Scaffolding script
│  README.md                       # Root README
├─ apps/      
│   └─ web/                        # Next.js 14 App Router frontend
└─ packages/      
└─ database/                       # Prisma schema & generated client
</ProjectLayout>

<StepsToFollow>
- Perform a comprehensive inventory of the codebase. Search for and view:
- README.md, CONTRIBUTING.md, and all other documentation files.
- All scripts, particularly those pertaining to build and repo or environment setup.
- All build and actions pipelines.
- All project files.
- All configuration and linting files.
- For each file:
- think: are the contents or the existence of the file information that the coding agent will need to implement, build, test, validate, or demo a code change?
- If yes:
   - Document the command or information in detail.
   - Explicitly indicate which commands work and which do not and the order in which commands should be run.
   - Document any errors encountered as well as the steps taken to workaround them.
- Document any other steps or information that the agent can use to reduce time spent exploring or trying and failing to run bash commands.
- Finally, explicitly instruct the agent to trust the instructions and only perform a search if the information in the instructions is incomplete or found to be in error.
</StepsToFollow>

