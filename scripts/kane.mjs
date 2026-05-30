// Shared helpers for invoking Kane CLI and parsing its NDJSON output.
// Used by the studio server and the CLI verify script.
import { spawn } from "node:child_process";

/**
 * Run a Kane testmd file headless and resolve with a structured result.
 * Waits for the process to exit (the steering rule: act only on run_end /
 * process exit, never on partial progress events).
 *
 * @param {string} testPath  path to a *_test.md file
 * @param {object} [opts]
 * @param {number} [opts.timeout=120] hard timeout in seconds
 * @returns {Promise<{exitCode:number, runEnd:object|null, steps:object[], stderr:string}>}
 */
export function runKaneTest(testPath, opts = {}) {
  const timeout = opts.timeout ?? 75;
  return new Promise((resolve) => {
    const args = [
      "testmd",
      "run",
      testPath,
      "--agent",
      "--headless",
      "--retry",
      "--timeout",
      String(timeout),
    ];
    const child = spawn("kane-cli", args, { env: process.env });

    const steps = [];
    let runEnd = null;
    let stdoutBuf = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdoutBuf += chunk.toString();
      let nl;
      while ((nl = stdoutBuf.indexOf("\n")) >= 0) {
        const line = stdoutBuf.slice(0, nl).trim();
        stdoutBuf = stdoutBuf.slice(nl + 1);
        if (!line) continue;
        let obj;
        try {
          obj = JSON.parse(line);
        } catch {
          continue;
        }
        if (obj.type === "run_end") runEnd = obj;
        else if (obj.step != null) steps.push(obj);
      }
    });

    child.stderr.on("data", (c) => {
      stderr += c.toString();
    });

    child.on("error", (err) => {
      resolve({ exitCode: 2, runEnd: null, steps, stderr: stderr + String(err) });
    });

    child.on("close", (code) => {
      // flush any trailing buffered line
      const last = stdoutBuf.trim();
      if (last) {
        try {
          const obj = JSON.parse(last);
          if (obj.type === "run_end") runEnd = obj;
        } catch {
          /* ignore */
        }
      }
      resolve({ exitCode: code ?? 0, runEnd, steps, stderr });
    });
  });
}

/** Map a Kane run into a simple pass/fail + human detail. */
export function summarize(result) {
  const { exitCode, runEnd, steps } = result;
  if (exitCode === 0) {
    return {
      status: "passed",
      detail: runEnd?.one_liner || runEnd?.summary || "All steps passed.",
    };
  }
  if (exitCode === 1) {
    const failed = steps.find((s) => s.status === "failed");
    return {
      status: "failed",
      detail: failed?.remark || runEnd?.reason || "A rule assertion failed.",
    };
  }
  if (exitCode === 3) {
    return { status: "error", detail: "Kane timed out before finishing." };
  }
  return {
    status: "error",
    detail:
      runEnd?.reason ||
      "Kane could not run (auth or Chrome setup). Try `kane-cli whoami`.",
  };
}
