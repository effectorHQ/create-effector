# Changelog

## v1.0.0 — 2026-03-19

First stable release. Package scoped to `@effectorhq/create-effector`.

### Added
- **Linear-skill-lite template** — generated `SKILL.md` is immediately lint/eval/compile-passing, with Purpose / When to Use / When NOT to Use / Setup / Commands / Examples / Notes sections and working code blocks
- **Golden path next steps** — `npx @effectorhq/skill-lint` → `npx @effectorhq/skill-eval` → `npx @effectorhq/core validate` → `npx @effectorhq/core compile -t mcp`
- **CI workflow** — generated `.github/workflows/ci.yml` for `skill` type runs the full golden path

### Changed
- Default runtime changed from `openclaw` to `mcp`
- `openclaw` runtime renamed to `openclaw (legacy)` in interactive prompts
- Package name: `create-effector` → `@effectorhq/create-effector`
- Keywords updated: removed `openclaw`
- `effector.toml` template: adds `env-read`, `env-write`, `filesystem` permission fields for spec alignment

---

## v0.1.0 — 2026-03-05

### Added
- Initial release — scaffold `skill`, `extension`, `workflow`, `workspace`, `bridge`, `prompt` Effector types
- Interactive mode with name / type / runtime / directory selection
- Zero dependencies — Node.js built-ins only
