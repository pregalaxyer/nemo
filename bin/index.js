#!/usr/bin/env node
process.title = "@pregalaxyer/nemo";
const commander = require("commander");
const nemoMail = require("../lib/index");
// const path = require("path");

commander
  .version(require("../package").version)
  .usage("<command> [options]")
  .command("generate", 'generate file from a template (short-cut alias: "g")');

commander
  .command("output <api> [output]")
  .description("output typescript file", {
    api: "swagger api",
    output: "typescript file path",
  })
  .action((url, output) => {
    nemoMail({
      url,
      output,
    });
    console.log("parse swagger api is done!");
  });
commander.parse(process.argv);
