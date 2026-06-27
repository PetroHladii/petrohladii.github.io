const Knowledge = {

  articles: [],
  filteredArticles: [],

  init() {

    console.log("Knowledge module initialized");

    this.loadData();

    this.renderAuthors();
    this.renderCategories();
    this.renderArticles();

    this.bindEvents();

  },

  loadData() {

    console.log("Loading Knowledge data...");

    this.articles = [...KNOWLEDGE];

    this.filteredArticles = [...this.articles];

    console.table(this.articles);

  },

  renderAuthors() {

    console.log("Render authors");

  },

  renderCategories() {

    console.log("Render categories");

  },

  renderArticles() {

    console.log("Render articles");

    console.table(this.filteredArticles);

    const container =
      document.getElementById("articles");

    container.innerHTML = "";

    this.filteredArticles.forEach(article => {

      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "article-item";

      button.textContent =
        article.title;

      button.addEventListener(
        "click",
        () => {

          window.location.assign(
            `article.html?id=${article.id}`
          );
        }
      );

      container.appendChild(button);

    });

  },

  applyFilters() {

    console.log("Apply filters");

  },

  bindEvents() {

    console.log("Bind events");

  }

};

document.addEventListener(
  "DOMContentLoaded",
  () => Knowledge.init()
);