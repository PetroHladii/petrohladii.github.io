const Article = {

  article: null,

  init() {

    console.log("Article module initialized");

    const params =
      new URLSearchParams(window.location.search);

    const id =
      Number(params.get("id"));

    this.article =
      KNOWLEDGE.find(item => item.id === id);

    if (!this.article) {

      console.error("Article not found");

      document.title = "Статтю не знайдено";

      document.getElementById("contentTitle")
        .textContent = "Статтю не знайдено";

      return;

    }

    console.log(this.article);

    this.render();

    this.bindEvents();

  },

  render() {

    document.title =
      this.article.title;

    document.getElementById("contentTitle")
      .textContent =
      this.article.title;

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