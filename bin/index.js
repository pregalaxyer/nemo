#!/usr/bin/env node
process.title = "@pregalaxyer/nemo";
const { program } = require("commander");
const nemoMail = require("../lib/index");
program
  .allowUnknownOption()
  .version(require("../package.json").version)
  .usage("npx @pregalaxyer/nemo mail --url xxx --output xxx");
// npx @pregalaxyer/nemo mail --url http://10.8.101.10:8010/v2/api-docs --output ./src/api/test
// !by test ↓
// node bin/index.js mail --url http://10.8.101.10:8010/v2/api-docs --output ./src/api/test
program
  .command("mail")
  .option("-U, --url [path]", "swagger api url")
  .option("-O, --output [path]", "output floder")
  .option("-P, --paths [names]", "single-api or apis")
  .option("-R, --requestPath [path]", "where request module import from")
  .option("-E, --exportsRequest", "request templates only create and remove")
  .description("This is a tiger-cli tool.")
  .action((options) => {
    nemoMail(options);
  });
program.parse(process.argv);
