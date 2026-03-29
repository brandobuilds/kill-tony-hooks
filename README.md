# Kill Tony Hooks for Claude Code

Sound effects inspired by [Kill Tony](https://www.youtube.com/killtony) for [Claude Code](https://docs.anthropic.com/en/docs/claude-code). A kitten meows when a task completes. A West Hollywood bear growls when Claude needs your attention.

> **macOS only** -- uses `afplay` for audio playback. No dependencies beyond Node.js.

## Sound Map

| Sound | Event | When it plays |
|-------|-------|---------------|
| Kitten meow | `TaskCompleted` | A task is marked completed |
| Bear growl | `PermissionRequest` | Claude is waiting for you to approve/deny something |
| Bear growl | `PostToolUse` | Claude asks you a question (`AskUserQuestion`) |

## Quick Start

### 1. Clone and copy files

```sh
git clone https://github.com/brandobuilds/kill-tony-hooks.git
cp kill-tony-hooks/kill-tony-sounds.mjs ~/.claude/hooks/
mkdir -p ~/.claude/hooks/sounds
cp kill-tony-hooks/sounds/*.mp3 ~/.claude/hooks/sounds/
```

### 2. Add hooks to `~/.claude/settings.json`

Add these entries to the `"hooks"` object in your settings file:

```jsonc
{
  "hooks": {
    // Kitten meow when a task completes
    "TaskCompleted": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "CLAUDE_HOOK_EVENT=TaskCompleted node ~/.claude/hooks/kill-tony-sounds.mjs",
            "timeout": 1000
          }
        ]
      }
    ],

    // Bear growl when Claude needs permission
    "PermissionRequest": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "CLAUDE_HOOK_EVENT=PermissionRequest node ~/.claude/hooks/kill-tony-sounds.mjs",
            "timeout": 1000
          }
        ]
      }
    ],

    // Bear growl when Claude asks a question
    "PostToolUse": [
      {
        "matcher": "AskUserQuestion",
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/hooks/kill-tony-sounds.mjs",
            "timeout": 1000
          }
        ]
      }
    ]
  }
}
```

If you already have hooks configured for these events, add the kill-tony entries to your existing arrays.

### 3. Restart Claude Code

The hooks take effect on the next session.

## How It Works

The script reads Claude Code hook environment variables to decide which sound to play:

- **`CLAUDE_HOOK_EVENT`** -- set manually in the command for `TaskCompleted` and `PermissionRequest` hooks
- **`CLAUDE_TOOL_NAME`** -- checked on `PostToolUse` to detect `AskUserQuestion` calls

Sounds play via `afplay` in a detached child process so they never block Claude's execution.

## Customizing Sounds

Replace the MP3 files in `~/.claude/hooks/sounds/`:

```
~/.claude/hooks/sounds/
  kitten-final.mp3   # plays on task completion
  bear-final.mp3     # plays when Claude needs attention
```

Any MP3 works. Keep clips short (1-3 seconds) for the best drop timing.

## File Structure

```
kill-tony-hooks/
  kill-tony-sounds.mjs       # hook script
  sounds/
    kitten-final.mp3          # kitten meow (task complete)
    bear-final.mp3            # bear growl (needs attention)
  README.md
```

## Requirements

- **macOS** (uses `afplay`)
- **Node.js** 18+
- **Claude Code** with hooks support

## License

MIT
