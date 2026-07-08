const Article = {

  article: null,

  async init() {

    console.log("Article module initialized");

    const params =
      new URLSearchParams(window.location.search);

    const id =
      Number(params.get("id"));

    this.article =
      KNOWLEDGE.find(item => item.id === id);

    if (!this.article) {

      console.error("Article not found");

      document.title =
        "Статтю не знайдено";

      document
        .getElementById("contentTitle")
        .textContent =
        "Статтю не знайдено";

      return;

    }

    console.log(this.article);

    this.render();

    await this.loadContent();

    this.bindEvents();

  },

  render() {

    document.title =
      this.article.title;

    document
      .getElementById("contentTitle")
      .textContent =
      this.article.title;

  },

  async loadContent() {

    const container =
      document.getElementById("contentBody");

    try {

      const response =
        await fetch(
          `text/${this.article.contentFile}`
        );

      if (!response.ok) {
        throw new Error(
          "Content file not found"
        );
      }

      const html =
        await response.text();

      container.innerHTML =
        html;

    }
    catch (error) {

      console.error(error);

      container.innerHTML = `
        <p>
          Не вдалося завантажити текст статті.
        </p>
      `;

    }

  },

  bindEvents() {

    document
      .getElementById("backButton")
      .addEventListener(
        "click",
        () => history.back()
      );

  }

};

document.addEventListener(
  "DOMContentLoaded",
  () => Article.init()
);