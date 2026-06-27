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

    const container =
      document.getElementById("authorFilters");

    container.innerHTML = "";

    Object.entries(AUTHORS).forEach(([key, name]) => {

      const label =
        document.createElement("label");

      const checkbox =
        document.createElement("input");

      checkbox.type = "checkbox";

      checkbox.value = key;

      checkbox.className = "author-filter";

      label.appendChild(checkbox);

      label.append(
        document.createTextNode(" " + name)
      );

      container.appendChild(label);

    });

  },

  renderCategories() {

    console.log("Render categories");

    const container =
      document.getElementById("categoryFilters");

    container.innerHTML = "";

    Object.entries(CATEGORIES).forEach(([key, name]) => {

      const label =
        document.createElement("label");

      const checkbox =
        document.createElement("input");

      checkbox.type = "checkbox";

      checkbox.value = key;

      checkbox.className = "category-filter";

      label.appendChild(checkbox);

      label.append(
        document.createTextNode(" " + name)
      );

      container.appendChild(label);

    });

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