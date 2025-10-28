import { WidgetConfig, createElement } from "./utils.js";
import { submitFeedback } from "./api.js";

export class FeedbackWidget {
  private config: WidgetConfig;
  private container: HTMLDivElement | null = null;
  private isOpen: boolean = false;
  private rating: number = 0;

  constructor(config: WidgetConfig) {
    this.config = config;
    this.init();
  }

  private init(): void {
    this.createWidget();
    this.applyTheme();
  }

  private createWidget(): void {
    // Создание главного контейнера виджета
    this.container = createElement("div", [
      "feedback-widget",
      `feedback-widget--${this.config.position}`,
      `feedback-widget--${this.config.theme}`,
    ]);

    // Кнопка для открытия виджета
    const triggerButton = createElement(
      "button",
      ["feedback-widget__trigger"],
      {
        "aria-label": "Open feedback form",
      }
    );
    triggerButton.innerHTML = "💬";
    triggerButton.addEventListener("click", () => this.toggle());

    // Модальное окно с формой
    const modal = this.createModal();

    this.container.appendChild(triggerButton);
    this.container.appendChild(modal);

    document.body.appendChild(this.container);
  }

  private createModal(): HTMLDivElement {
    const modal = createElement("div", ["feedback-widget__modal"]);

    // Заголовок
    const header = createElement("div", ["feedback-widget__header"]);
    const title = createElement("h3", ["feedback-widget__title"]);
    title.textContent = "Как вам наш сервис?";

    const closeBtn = createElement("button", ["feedback-widget__close"], {
      "aria-label": "Close feedback form",
    });
    closeBtn.innerHTML = "×";
    closeBtn.addEventListener("click", () => this.close());

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Форма
    const form = this.createForm();

    modal.appendChild(header);
    modal.appendChild(form);

    return modal;
  }

  private createForm(): HTMLFormElement {
    const form = createElement("form", [
      "feedback-widget__form",
    ]) as HTMLFormElement;

    // Рейтинг (звёзды)
    const ratingContainer = createElement("div", ["feedback-widget__rating"]);
    const ratingLabel = createElement("label", ["feedback-widget__label"]);
    ratingLabel.textContent = "Оценка:";

    const stars = createElement("div", ["feedback-widget__stars"]);
    for (let i = 1; i <= 5; i++) {
      const star = createElement("span", ["feedback-widget__star"], {
        "data-rating": i.toString(),
      });
      star.innerHTML = "★";
      star.addEventListener("click", () => this.setRating(i));
      stars.appendChild(star);
    }

    ratingContainer.appendChild(ratingLabel);
    ratingContainer.appendChild(stars);

    // Текстовое поле
    const messageContainer = createElement("div", ["feedback-widget__field"]);
    const messageLabel = createElement("label", ["feedback-widget__label"]);
    messageLabel.textContent = "Ваш отзыв:";

    const textarea = createElement("textarea", ["feedback-widget__textarea"], {
      placeholder: "Расскажите подробнее...",
      rows: "4",
      name: "message",
    }) as HTMLTextAreaElement;

    messageContainer.appendChild(messageLabel);
    messageContainer.appendChild(textarea);

    // Кнопка отправки
    const submitBtn = createElement("button", ["feedback-widget__submit"], {
      type: "submit",
    });
    submitBtn.textContent = "Отправить";

    // Обработка отправки
    form.addEventListener("submit", (e) => this.handleSubmit(e));

    form.appendChild(ratingContainer);
    form.appendChild(messageContainer);
    form.appendChild(submitBtn);

    return form;
  }

  private setRating(rating: number): void {
    this.rating = rating;

    // Обновление визуального отображения
    const stars = this.container?.querySelectorAll(".feedback-widget__star");
    stars?.forEach((star, index) => {
      if (index < rating) {
        star.classList.add("feedback-widget__star--active");
      } else {
        star.classList.remove("feedback-widget__star--active");
      }
    });
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const message = formData.get("message") as string;

    if (!message.trim()) {
      alert("Пожалуйста, напишите отзыв");
      return;
    }

    // Отправка данных
    const result = await submitFeedback(this.config.apiUrl, {
      projectId: this.config.projectId,
      rating: this.rating,
      message: message,
      url: window.location.href,
      userAgent: navigator.userAgent,
    });

    if (result.success) {
      this.showSuccess();
      form.reset();
      this.setRating(0);

      setTimeout(() => {
        this.close();
      }, 2000);
    } else {
      alert("Ошибка при отправке отзыва. Попробуйте позже.");
    }
  }

  private showSuccess(): void {
    const modal = this.container?.querySelector(".feedback-widget__modal");
    if (modal) {
      modal.innerHTML = `
        <div class="feedback-widget__success">
          <div class="feedback-widget__success-icon">✓</div>
          <h3>Спасибо за отзыв!</h3>
          <p>Ваше мнение очень важно для нас.</p>
        </div>
      `;
    }
  }

  private toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  private open(): void {
    this.container?.classList.add("feedback-widget--open");
    this.isOpen = true;
  }

  private close(): void {
    this.container?.classList.remove("feedback-widget--open");
    this.isOpen = false;
  }

  private applyTheme(): void {
    if (this.container) {
      this.container.style.setProperty(
        "--widget-primary-color",
        this.config.color
      );
    }
  }

  public destroy(): void {
    this.container?.remove();
  }
}
