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

    this.renderPhotos();

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

  renderPhotos() {

    const section =
      document.getElementById("photosSection");

    const container =
      document.getElementById("contentPhotos");

    container.innerHTML = "";

    if (
      !this.article.photos ||
      this.article.photos.length === 0
    ) {

      return;

    }

    const photos =
      this.article.photos.filter(photo =>
        photo.file && photo.file.trim() !== ""
      );

    if (photos.length === 0) {

      return;

    }

    section.classList.remove("hidden");

    photos.forEach(photo => {

      const card =
        document.createElement("div");

      card.className =
        "photo-card";

      const image =
        document.createElement("img");

      image.src =
        `${CONFIG.knowledgeBase}/${this.article.id}/photos/${photo.file}`;

      image.alt =
        photo.title;

      image.loading =
        "lazy";

      image.addEventListener(
        "click",
        () => {

          window.open(
            image.src,
            "_blank"
          );

        }
      );

      const caption =
        document.createElement("div");

      caption.className =
        "photo-title";

      caption.textContent =
        photo.title;

      card.appendChild(image);

      card.appendChild(caption);

      container.appendChild(card);

    });

  },

  renderFiles() {

    const section =
      document.getElementById("filesSection");

    const container =
      document.getElementById("contentFiles");

    container.innerHTML = "";

    if (
      !this.article.files ||
      this.article.files.length === 0
    ) {

      return;

    }

    const files =
      this.article.files.filter(file =>
        file.file && file.file.trim() !== ""
      );

    if (files.length === 0) {

      return;

    }

    section.classList.remove("hidden");

    files.forEach(file => {

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