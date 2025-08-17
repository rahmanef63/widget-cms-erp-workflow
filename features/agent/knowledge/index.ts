// Export all knowledge components from consolidated structure
export * from "./cms-base-knowledge"
export * from "./faq-examples"
export * from "./system-prompts"

// Knowledge files as markdown imports
export { default as CorePrinciples } from "./core-principles.md"
export { default as BestPractices } from "./best-practices.md"
export { default as CommonQuestions } from "./common-questions.md"

// Main knowledge export for agent system
export const AGENT_KNOWLEDGE = {
  // CMS-specific knowledge
  cmsBase: () => import("./cms-base-knowledge").then(m => m.CMS_BASE_KNOWLEDGE),
  faqExamples: () => import("./faq-examples").then(m => m.CMS_FAQ_EXAMPLES),
  
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
    corePrinciples: () => import("./core-principles.md"),
    bestPractices: () => import("./best-practices.md"),
    commonQuestions: () => import("./common-questions.md")
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
