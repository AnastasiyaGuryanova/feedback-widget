import { getWidgetConfig } from "./utils.js";
import { FeedbackWidget } from "./widget.js";
import "./styles.scss";

// Инициализация виджета при загрузке скрипта
(function initFeedbackWidget() {
  try {
    const config = getWidgetConfig();

    if (!config.projectId) {
      console.error("FeedbackWidget: projectId is required");
      return;
    }

    // Ждём загрузки DOM
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        new FeedbackWidget(config);
      });
    } else {
      new FeedbackWidget(config);
    }
  } catch (error) {
    console.error("FeedbackWidget initialization error:", error);
  }
})();
