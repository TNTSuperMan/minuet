#!/usr/bin/env bun

import { spawn } from "bun";
import { watch } from "fs";

// srcを監視してPrettierを出すスクリプトです

watch("./src", { recursive: true }, (ev, f) => {
  console.log(f);
  if (f)
    spawn({
      cmd: ["bunx", "prettier", "--write", `./src/${f}`],
      stdout: "pipe",
    });
});
