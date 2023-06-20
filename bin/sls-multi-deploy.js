#!/usr/bin/env node
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

const __run = require("../lib/deploy-process.js");

console.log(argv, "daat");
__run();
// yarn run deploy --env=test --stage=stage-pjs --profile=live
