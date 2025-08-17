import { listModels } from "./registry"
import { CMS_BASE_KNOWLEDGE } from "./base-knowledge"
import { CMS_FAQ_EXAMPLES } from "./faq"
import { CMS_CREATE_SCHEMA_SYSTEM, CMS_CREATE_SCHEMA_INSTRUCTIONS } from "./knowledge"
import { CMS_TOOL_MANIFEST } from "./tool-manifest"

export function getAgentManifest() {
  return {
    models: listModels(),
    knowledge: {
      base: CMS_BASE_KNOWLEDGE,
      faq: CMS_FAQ_EXAMPLES,
      createSchemaSystem: CMS_CREATE_SCHEMA_SYSTEM,
      createSchemaInstructions: CMS_CREATE_SCHEMA_INSTRUCTIONS,
      toolManifest: CMS_TOOL_MANIFEST,
    },
  }
}
