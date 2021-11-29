const yargs = require("yargs");
const { version, name } = require("../package.json");
const nemo = require("../lib/index");

const cli = yargs
  .scriptName(name)
  .version(version)
  .strict()
  .alias("h", "help")
  .alias("v", "version");

let argv = cli
  .command("convert [options]", "Convert swagger schema to typescript files")
  .option("input", {
    alias: "i",
    description: "Swagger api schema json url",
    type: "string",
    demandOption: true,
  })
  .option("output", {
    alias: "o",
    description: "Output folder path",
    type: "string",
    demandOption: true,
  })
  .option("library", {
    alias: "li",
    description: "Request library path",
    type: "string",
  })
  .showHelpOnFail(true).argv;

nemo({
  url: argv.input,
  output: argv.output,
  requestPath: argv.library,
});
