# Changelog

All notable changes to Kill Tony Hooks will be documented in this file.

## [1.0.0] - 2026-03-29

### Added
- Kill Tony sound effects hook for Claude Code — kitten meow on task complete, bear growl when Claude needs attention
- `kill-tony-sounds.mjs` hook script reading `CLAUDE_HOOK_EVENT` and `CLAUDE_TOOL_NAME` env vars
- Audio playback via `afplay` in detached child process (never blocks Claude)
- Sound files: `kitten-final.mp3` (task complete), `bear-final.mp3` (needs attention)
- Hooks wired to `TaskCompleted`, `PermissionRequest`, and `PostToolUse` (`AskUserQuestion`)
- README with sound map, quick start, and configuration guide
