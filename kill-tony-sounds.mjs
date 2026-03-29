#!/usr/bin/env node

// Kill Tony sound effects for Claude Code hooks
// Kitten meow: task completed, subagent finished
// Bear growl: tool denied or failed/cancelled

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
const toolInput = process.env.CLAUDE_TOOL_INPUT || "";
const toolResult = process.env.CLAUDE_TOOL_RESULT || "";

// Bear: conversation starting
if (hookEvent === "SessionStart") {
  play(BEAR);
  process.exit(0);
}

// Kitten: subagent finished
if (hookEvent === "SubagentStop") {
  play(KITTEN);
  process.exit(0);
}

// Kitten: compaction complete
if (hookEvent === "PreCompact") {
  play(KITTEN);
  process.exit(0);
}

// Kitten: task marked completed
if (toolName === "TaskUpdate") {
  try {
    const input = JSON.parse(toolInput);
    if (input.status === "completed") {
      play(KITTEN);
      process.exit(0);
    }
  } catch {}
}

// Bear: tool errors, failures, or cancellations
if (toolResult) {
  try {
    const result = JSON.parse(toolResult);
    const resultStr = JSON.stringify(result).toLowerCase();
    if (
      resultStr.includes('"error"') ||
      resultStr.includes("denied") ||
      resultStr.includes("cancelled") ||
      resultStr.includes("canceled") ||
      resultStr.includes("permission denied") ||
      resultStr.includes("failed")
    ) {
      play(BEAR);
    }
  } catch {
    const lower = toolResult.toLowerCase();
    if (
      lower.includes("error") ||
      lower.includes("denied") ||
      lower.includes("cancelled") ||
      lower.includes("failed")
    ) {
      play(BEAR);
    }
  }
}
