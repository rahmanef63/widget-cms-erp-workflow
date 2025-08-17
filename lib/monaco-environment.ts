import * as monaco from "monaco-editor"

// Configure Monaco Environment for web workers
if (typeof window !== "undefined") {
  ;(window as any).MonacoEnvironment = {
    getWorkerUrl: (moduleId: string, label: string) => {
      if (label === "json") {
        return "./json.worker.bundle.js"
      }
      if (label === "css" || label === "scss" || label === "less") {
        return "./css.worker.bundle.js"
      }
      if (label === "html" || label === "handlebars" || label === "razor") {
        return "./html.worker.bundle.js"
      }
      if (label === "typescript" || label === "javascript") {
        return "./ts.worker.bundle.js"
      }
      return "./editor.worker.bundle.js"
    },
  }
}

if (typeof self !== "undefined") {
  ;(self as any).MonacoEnvironment = {
    getWorkerUrl: (moduleId: string, label: string) => {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
      if (label === "json") {
        return `${baseUrl}/monaco-editor/min/vs/language/json/json.worker.js`
      }
      if (label === "css" || label === "scss" || label === "less") {
        return `${baseUrl}/monaco-editor/min/vs/language/css/css.worker.js`
      }
      if (label === "html" || label === "handlebars" || label === "razor") {
        return `${baseUrl}/monaco-editor/min/vs/language/html/html.worker.js`
      }
      if (label === "typescript" || label === "javascript") {
        return `${baseUrl}/monaco-editor/min/vs/language/typescript/ts.worker.js`
      }
      return `${baseUrl}/monaco-editor/min/vs/editor/editor.worker.js`
    },
  }
}

// Widget Builder Monaco Configuration
export const widgetBuilderMonacoConfig = {
  theme: "vs-dark",
  language: "typescript",
  automaticLayout: true,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: "on",
  lineNumbers: "on",
  glyphMargin: false,
  folding: false,
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
  renderLineHighlight: "none",
}

// Widget Function Monaco Configuration
export const widgetFunctionMonacoConfig = {
  theme: "vs-light",
  language: "javascript",
  automaticLayout: true,
  minimap: { enabled: true },
  scrollBeyondLastLine: true,
  wordWrap: "off",
  lineNumbers: "on",
  glyphMargin: true,
  folding: true,
  lineDecorationsWidth: 10,
  lineNumbersMinChars: 3,
  renderLineHighlight: "all",
}

export default monaco
