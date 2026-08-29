## Agent skills

### Issue tracker

Issues and specs live as local markdown files in `.scratch/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context layout: `CONTEXT.md` and `docs/adr/` at repo root. See `docs/agents/domain.md`.

### Dev workflow

Startup commands, integration checks, and troubleshooting: see `docs/development-workflow.md`.

### Doc routing

Where new content goes — one home per kind:

- Process docs (plans, checklists, acceptance records): `.scratch/<feature-slug>/` — deleted when the feature is done
- Decisions: `docs/adr/` — append-only, numbered（模板与写作规范见 `docs/adr/README.md`）
- Terminology / architecture: `CONTEXT.md`
- Living operating docs (workflows, troubleshooting): `docs/*.md` — keep current; git history is the archive, no `docs/archive/`
