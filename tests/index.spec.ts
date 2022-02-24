// TODO for lib test

import main from "../esm/index";
import * as fs from "fs-extra";
import path from "path";

test("lib excute", async () => {
  await main({
    url: "https://petstore.swagger.io/v2/swagger.json",
    output: "./tests/.output",
    requestPath: "@/request.ts",
    paths: undefined,
    exportsRequest: true,
  });

  const [models, services] = await Promise.all([
    fs.readdirSync(path.resolve(__dirname, ".output/models")),
    fs.readdirSync(path.resolve(__dirname, ".output/services")),
  ]);
  expect(models).toBeDefined();
  expect(services).toBeDefined();
});
