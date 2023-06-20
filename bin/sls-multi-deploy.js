#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

const __run = require("../lib/deploy-process.js");

__run({
  type: argv.type,
  env: argv.env,
  stage: argv.stage,
  profile: argv.profile,
});
