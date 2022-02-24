import { convertModels } from "../interfaces/index";
import { Swagger } from "../types";
import { convertService } from "../services/index";
export const handleTsPath = (path: string) => {
  if (!path) return "";
  return path.replace(/\.ts/g, (str) => {
    return "";
  });
};
export function handlePaths(res: Swagger, paths?: Array<string | RegExp>) {
  let models = [],
    services;
  if (paths) {
    Object.keys(res.paths).forEach((swaggerPath) => {
      if (
        paths.filter((path) =>
          typeof path === "string"
            ? path === swaggerPath
            : path.test(swaggerPath)
        ).length === 0
      ) {
        delete res.paths[swaggerPath];
      }
    });
    // need exclude no request controller
    services = convertService(res).filter((service) => service.requests.length);
    let imports = services.reduce((pre, cur) => pre.concat(cur.imports), []);
    let allModels = convertModels(res.definitions);
    // recursive search for the api models and imports the model linked
    function deepModels(imports) {
      if (!imports) return;
      models.push(...allModels.filter((model) => imports.includes(model.name)));
      let names = models.map((model) => model.name);
      models.forEach((model) => {
        if (model.imports) {
          let excludeDeps = model.imports.filter(
            (linkImport) => !names.includes(linkImport)
          );
          if (excludeDeps.length) {
            deepModels(excludeDeps);
          }
        }
      });
    }
    deepModels(imports);
  } else {
    services = convertService(res);
    models = convertModels(res.definitions);
  }
  return {
    models,
    services,
  };
}
