const Models3D = {

  articles: [],

  filteredArticles: [],

  async init() {

    try {

      await Access.ready();

    }
    catch (error) {

      console.error(
        "Access initialization error:",
        error
      );

      document
        .getElementById("accessDenied")
        .classList
        .remove("hidden");

      document
        .getElementById("moduleContent")
        .classList
        .add("hidden");

      return;

    }

    if (
      !Access.hasPermission(
        PERMISSIONS.MODULE_MODELS3D
      )
    ) {

      document
        .getElementById("accessDenied")
        .classList
        .remove("hidden");

      document
        .getElementById("moduleContent")
        .classList
        .add("hidden");

      return;

    }

    document
      .getElementById("moduleContent")
      .classList
      .remove("hidden");

    this.loadData();

    this.renderAuthors();

  },

  loadData() {

    this.articles = [
      ...MODELS
    ];

    this.filteredArticles = [
      ...this.articles
    ];

  },

  renderAuthors() {

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

  }

};

document.addEventListener(
  "DOMContentLoaded",
  () => Models3D.init()
);