const Knowledge = {

  articles: [],

  filteredArticles: [],

  currentUser: null,

  allowedCategories: [],


  async init() {

    console.log(
      "Knowledge module initialized"
    );

    const accessLoaded =
      await this.loadAccess();

    if (!accessLoaded) {

      return;

    }

    this.loadData();

    this.renderAuthors();

    this.renderCategories();

    this.renderArticles();

    this.bindEvents();

  },


  async loadAccess() {

    console.log(
      "Loading user access..."
    );

    try {

      const response =
        await fetch(
          "/api/me",
          {
            method: "GET",

            credentials:
              "same-origin",

            cache:
              "no-store"
          }
        );

      if (
        response.status === 401
      ) {

        window.location.replace(
          "/login.html"
        );

        return false;

      }

      if (!response.ok) {

        throw new Error(
          "Failed to load access"
        );

      }

      const data =
        await response.json();

      if (
        !data.success ||
        !data.user
      ) {

        throw new Error(
          "Invalid access response"
        );

      }

      this.currentUser =
        data.user;

      this.allowedCategories =
        data.user
          .knowledge
          ?.categories ?? [];

      console.log(
        "Current user:",
        this.currentUser
      );

      console.log(
        "Allowed categories:",
        this.allowedCategories
      );

      return true;

    }
    catch (error) {

      console.error(
        "Access loading error:",
        error
      );

      document
        .getElementById("articles")
        .innerHTML = `
          <div class="panel">
            Не вдалося перевірити права доступу.
          </div>
        `;

      document
        .getElementById("resultsInfo")
        .textContent = "";

      return false;

    }

  },


  hasPermission(permission) {

    const permissions =
      this.currentUser
        ?.permissions;

    if (
      !Array.isArray(permissions)
    ) {

      return false;

    }

    return (
      permissions.includes("*") ||
      permissions.includes(permission)
    );

  },


  canAccessCategory(category) {

    if (
      !this.hasPermission(
        "module.knowledge"
      )
    ) {

      return false;

    }

    if (
      this.allowedCategories === "*"
    ) {

      return true;

    }

    if (
      !Array.isArray(
        this.allowedCategories
      )
    ) {

      return false;

    }

    return this.allowedCategories.includes(category);

  },


  loadData() {

    console.log(
      "Loading Knowledge data..."
    );

    this.articles =
      KNOWLEDGE.filter(
        article =>
          this.canAccessCategory(
            article.category
          )
      );

    this.filteredArticles = [
      ...this.articles
    ];

    console.table(
      this.articles
    );

  },


  renderAuthors() {

    console.log(
      "Render authors"
    );

    const container =
      document.getElementById(
        "authorFilters"
      );

    container.innerHTML = "";

    const availableAuthors =
      new Set(
        this.articles.map(
          article =>
            article.author
        )
      );

    Object
      .entries(AUTHORS)
      .forEach(
        ([key, name]) => {

          if (
            !availableAuthors.has(key)
          ) {

            return;

          }

          const label =
            document.createElement(
              "label"
            );

          const checkbox =
            document.createElement(
              "input"
            );

          checkbox.type =
            "checkbox";

          checkbox.value =
            key;

          checkbox.className =
            "author-filter";

          label.appendChild(
            checkbox
          );

          label.append(
            document.createTextNode(
              " " + name
            )
          );

          container.appendChild(
            label
          );

        }
      );

  },


  renderCategories() {

    console.log(
      "Render categories"
    );

    const container =
      document.getElementById(
        "categoryFilters"
      );

    container.innerHTML = "";

    const availableCategories =
      new Set(
        this.articles.map(
          article =>
            article.category
        )
      );

    Object
      .entries(CATEGORIES)
      .forEach(
        ([key, name]) => {

          if (
            !availableCategories.has(key)
          ) {

            return;

          }

          const label =
            document.createElement(
              "label"
            );

          const checkbox =
            document.createElement(
              "input"
            );

          checkbox.type =
            "checkbox";

          checkbox.value =
            key;

          checkbox.className =
            "category-filter";

          label.appendChild(
            checkbox
          );

          label.append(
            document.createTextNode(
              " " + name
            )
          );

          container.appendChild(
            label
          );

        }
      );

  },


  renderArticles() {

    console.log(
      "Render articles"
    );

    const container =
      document.getElementById(
        "articles"
      );

    container.innerHTML = "";

    this.filteredArticles
      .forEach(article => {

        const button =
          document.createElement(
            "button"
          );

        button.type =
          "button";

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

        container.appendChild(
          button
        );

      });

    this.renderResultsInfo();

  },


  renderResultsInfo() {

    const container =
      document.getElementById(
        "resultsInfo"
      );

    const shown =
      this.filteredArticles.length;

    const total =
      this.articles.length;

    container.textContent =
      `Показано ${shown} із ${total} статей`;

  },


  applyFilters() {

    console.log(
      "Apply filters"
    );

    const search =
      document
        .getElementById(
          "searchInput"
        )
        .value
        .trim()
        .toLowerCase();

    const authors =
      [
        ...document
          .querySelectorAll(
            ".author-filter:checked"
          )
      ]
        .map(
          item =>
            item.value
        );

    const categories =
      [
        ...document
          .querySelectorAll(
            ".category-filter:checked"
          )
      ]
        .map(
          item =>
            item.value
        );

    this.filteredArticles =
      this.articles.filter(
        article => {

          const authorMatch =
            authors.length === 0 ||
            authors.includes(
              article.author
            );

          const categoryMatch =
            categories.length === 0 ||
            categories.includes(
              article.category
            );

          const categoryName =
            CATEGORIES[
              article.category
            ] || "";

          const searchMatch =
            search === "" ||

            article.title
              .toLowerCase()
              .includes(search) ||

            categoryName
              .toLowerCase()
              .includes(search);

          return (
            authorMatch &&
            categoryMatch &&
            searchMatch
          );

        }
      );

    this.renderArticles();

  },


  bindEvents() {

    console.log(
      "Bind events"
    );

    document
      .getElementById(
        "searchInput"
      )
      .addEventListener(
        "input",
        () =>
          this.applyFilters()
      );

    document
      .querySelectorAll(
        ".author-filter"
      )
      .forEach(filter => {

        filter.addEventListener(
          "change",
          () =>
            this.applyFilters()
        );

      });

    document
      .querySelectorAll(
        ".category-filter"
      )
      .forEach(filter => {

        filter.addEventListener(
          "change",
          () =>
            this.applyFilters()
        );

      });

  }

};


document.addEventListener(
  "DOMContentLoaded",
  () => Knowledge.init()
);