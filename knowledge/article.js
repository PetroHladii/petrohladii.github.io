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

    this.renderFiles();

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

  renderFiles() {

    const container =
      document.getElementById("contentFiles");

    container.innerHTML = "";

    if (
      !this.article.files ||
      this.article.files.length === 0
    ) {

      return;

    }

    const title =
      document.createElement("h3");

    title.textContent =
      "Документи";

    container.appendChild(title);

    this.article.files.forEach(file => {

      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "article-file";

      button.textContent =
        `📄 ${file.title}`;

      button.addEventListener(
        "click",
        () => {

          window.open(
            //`files/${file.file}`,
            `${CONFIG.knowledgeBase}/${this.article.id}/files/${file.file}`,
            "_blank"
          );

        }
      );

      container.appendChild(button);

    });

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