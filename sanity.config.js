import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId, studioBasePath } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { singletonDocumentTypes, structure } from "./src/sanity/structure";

export default defineConfig({
  name: "default",
  title: "White Horse Inn Launceston",
  projectId,
  dataset,
  basePath: studioBasePath,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) => !singletonDocumentTypes.has(schemaType),
      ),
  },
  document: {
    actions: (actions, context) =>
      singletonDocumentTypes.has(context.schemaType)
        ? actions.filter(
            ({ action }) => action !== "duplicate" && action !== "unpublish",
          )
        : actions,
  },
});
