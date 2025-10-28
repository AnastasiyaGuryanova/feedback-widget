/**
 * Интерфейс для отправки отзыва
 */
export interface FeedbackData {
  projectId: string;
  rating?: number;
  message: string;
  url: string;
  userAgent: string;
}

/**
 * Отправка отзыва на сервер
 */
export async function submitFeedback(
  apiUrl: string,
  data: FeedbackData
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to submit feedback");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { success: false, message: "Failed to send feedback" };
  }
}
