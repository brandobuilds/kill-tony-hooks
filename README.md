# Kill Tony Hooks for Claude Code

Sound effects inspired by [Kill Tony](https://www.youtube.com/killtony) for [Claude Code](https://docs.anthropic.com/en/docs/claude-code). A kitten meows when things go right. A West Hollywood bear growls when things go wrong.

> **macOS only** -- uses `afplay` for audio playback. No dependencies beyond Node.js.

## Sound Map

| Sound | Event | When it plays |
|-------|-------|---------------|
| Kitten meow | `SubagentStop` | A subagent finishes its work |
| Kitten meow | `PostToolUse` | A task is marked completed |
| Kitten meow | `PreCompact` | Context compaction triggers |
| Bear growl | `SessionStart` | A new conversation begins |
| Bear growl | `PostToolUse` | A tool returns an error, denial, or failure |

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
    // Add bear growl to SessionStart
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "CLAUDE_HOOK_EVENT=SessionStart node ~/.claude/hooks/kill-tony-sounds.mjs",
            "timeout": 1000
          }
        ]
      }
    ],

    // Add kitten meow to SubagentStop
    "SubagentStop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "CLAUDE_HOOK_EVENT=SubagentStop node ~/.claude/hooks/kill-tony-sounds.mjs",
            "timeout": 1000
          }
        ]
      }
    ],

    // Add both sounds to PostToolUse (kitten on task complete, bear on errors)
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node ~/.claude/hooks/kill-tony-sounds.mjs",
            "timeout": 1000
          }
        ]
      }
    ],

    // Add kitten meow to PreCompact
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "CLAUDE_HOOK_EVENT=PreCompact node ~/.claude/hooks/kill-tony-sounds.mjs",
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

- **`CLAUDE_HOOK_EVENT`** -- set manually in the command for `SessionStart`, `SubagentStop`, and `PreCompact` hooks
- **`CLAUDE_TOOL_NAME`** + **`CLAUDE_TOOL_INPUT`** -- checked on `PostToolUse` to detect task completions
- **`CLAUDE_TOOL_RESULT`** -- checked on `PostToolUse` for error keywords (`error`, `denied`, `cancelled`, `failed`)

Sounds play via `afplay` in a detached child process so they never block Claude's execution.

## Customizing Sounds

Replace the MP3 files in `~/.claude/hooks/sounds/`:

```
~/.claude/hooks/sounds/
  kitten-final.mp3   # plays on success
  bear-final.mp3     # plays on errors + session start
```

Any MP3 works. Keep clips short (1-3 seconds) for the best drop timing.

## File Structure

```
kill-tony-hooks/
  kill-tony-sounds.mjs       # hook script
  sounds/
    kitten-final.mp3          # kitten meow (success)
    bear-final.mp3            # bear growl (errors + session start)
  README.md
```

## Requirements

- **macOS** (uses `afplay`)
- **Node.js** 18+
- **Claude Code** with hooks support

## License

MIT
