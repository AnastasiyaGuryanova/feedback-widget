/**
 * Получение конфигурации виджета из data-атрибутов скрипта
 */
export interface WidgetConfig {
  projectId: string;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  theme: "light" | "dark";
  color: string;
  apiUrl: string;
}

export function getWidgetConfig(): WidgetConfig {
  // Ищем скрипт виджета по селектору
  const script = document.querySelector<HTMLScriptElement>(
    "script[data-project-id]"
  );

  if (!script) {
    console.warn("Widget script not found, using default config");
    return {
      projectId: "demo-project",
      position: "bottom-right",
      theme: "light",
      color: "#0f4c81",
      apiUrl: "http://localhost:3000/api/feedback",
    };
  }

  return {
    projectId: script.dataset.projectId || "demo-project",
    position:
      (script.dataset.position as WidgetConfig["position"]) || "bottom-right",
    theme: (script.dataset.theme as WidgetConfig["theme"]) || "light",
    color: script.dataset.color || "#0f4c81",
    apiUrl: script.dataset.apiUrl || "http://localhost:3000/api/feedback",
  };
}

/**
 * Создание DOM элемента с классами и атрибутами
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  classes: string[] = [],
  attributes: Record<string, string> = {}
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (classes.length > 0) {
    element.classList.add(...classes);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  return element;
}
