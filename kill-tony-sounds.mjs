#!/usr/bin/env node

// Kill Tony sound effects for Claude Code hooks
// Kitten meow: task completed
// Bear growl: needs your attention (permission request or question)

import { spawn } from "child_process";
import { resolve } from "path";
import { homedir } from "os";

const SOUNDS_DIR = resolve(homedir(), ".claude/hooks/sounds");
const KITTEN = resolve(SOUNDS_DIR, "kitten-final.mp3");
const BEAR = resolve(SOUNDS_DIR, "bear-final.mp3");

function play(file) {
  const child = spawn("afplay", [file], {
    detached: true,
    stdio: "ignore",
  });
  child.unref();
}

const hookEvent = process.env.CLAUDE_HOOK_EVENT || "";
const toolName = process.env.CLAUDE_TOOL_NAME || "";

// Kitten: task completed
if (hookEvent === "TaskCompleted") {
  play(KITTEN);
  process.exit(0);
}

// Bear: permission request (waiting for approve/deny)
if (hookEvent === "PermissionRequest") {
  play(BEAR);
  process.exit(0);
}

// Bear: asking user a question
if (toolName === "AskUserQuestion") {
  play(BEAR);
}
