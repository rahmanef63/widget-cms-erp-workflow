// Agent Knowledge Base - Consolidated exports

// Base knowledge (general agent capabilities and guidelines)
export { default as CorePrinciples } from "./base/core-principles.md"
export { default as SupportedModels } from "./base/supported-models.md"
export { default as BestPractices } from "./base/best-practices.md"
export { default as CommonQuestions } from "./base/common-questions.md"

// Main knowledge export for agent system
export const AGENT_KNOWLEDGE = {
  // CMS-specific knowledge
  cmsBase: () => import("./propmpts/base-knowledge").then(m => m.CMS_BASE_KNOWLEDGE),
  faqExamples: () => import("./propmpts/faq-examples").then(m => m.CMS_FAQ_EXAMPLES),
  
  // System prompts
  systemPrompts: () => import("./system-prompts").then(m => ({
    createSchema: m.CMS_CREATE_SCHEMA_SYSTEM,
    createInstructions: m.CMS_CREATE_SCHEMA_INSTRUCTIONS,
    followupSystem: m.CMS_FOLLOWUP_SYSTEM,
    followupDefault: m.CMS_FOLLOWUP_DEFAULT,
    interaction: m.AGENT_INTERACTION_PROMPTS
  })),
  
  // Documentation
  docs: {
    corePrinciples: () => import("./base/core-principles.md"),
    bestPractices: () => import("./base/best-practices.md"),
    commonQuestions: () => import("./base/common-questions.md")
  }
}

// Convenience function to load all knowledge
export async function loadAllKnowledge() {
  const [cmsBase, faqExamples, systemPrompts] = await Promise.all([
    AGENT_KNOWLEDGE.cmsBase(),
    AGENT_KNOWLEDGE.faqExamples(),
    AGENT_KNOWLEDGE.systemPrompts()
  ])
  
  return {
    cmsBase,
    faqExamples,
    systemPrompts
  }
}
