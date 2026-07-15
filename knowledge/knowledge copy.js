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

    this.renderResultsInfo();

  },

  renderResultsInfo() {

    const container =
      document.getElementById("resultsInfo");

    const shown =
      this.filteredArticles.length;

    const total =
      this.articles.length;

    container.textContent =
      `Показано ${shown} із ${total} статей`;

  },

  applyFilters() {

    console.log("Apply filters");

    const search =
      document
        .getElementById("searchInput")
        .value
        .trim()
        .toLowerCase();

    const authors =
      [...document.querySelectorAll(".author-filter:checked")]
        .map(item => item.value);

    const categories =
      [...document.querySelectorAll(".category-filter:checked")]
        .map(item => item.value);

    this.filteredArticles =
      this.articles.filter(article => {

        const authorMatch =
          authors.length === 0 ||
          authors.includes(article.author);

        const categoryMatch =
          categories.length === 0 ||
          categories.includes(article.category);

        const searchMatch =
          search === "" ||

          article.title
            .toLowerCase()
            .includes(search) ||

          CATEGORIES[article.category]
            .toLowerCase()
            .includes(search);

        return (
          authorMatch &&
          categoryMatch &&
          searchMatch
        );

      });

    this.renderArticles();

  },

  bindEvents() {

    console.log("Bind events");

    document
      .getElementById("searchInput")
      .addEventListener(
        "input",
        () => this.applyFilters()
      );

    document
      .querySelectorAll(".author-filter")
      .forEach(filter => {

        filter.addEventListener(
          "change",
          () => this.applyFilters()
        );

      });

    document
      .querySelectorAll(".category-filter")
      .forEach(filter => {

        filter.addEventListener(
          "change",
          () => this.applyFilters()
        );

      });

  }

};

document.addEventListener(
  "DOMContentLoaded",
  () => Knowledge.init()
);