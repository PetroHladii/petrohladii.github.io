const ModelPage = {

  model: null,

  async init() {

    try {

      await Access.ready();

    }
    catch (error) {

      console.error(
        "Access initialization error:",
        error
      );

      this.showAccessDenied();

      return;

    }

    if (
      !Access.hasPermission(
        PERMISSIONS.MODULE_MODELS3D
      )
    ) {

      this.showAccessDenied();

      return;

    }

    if (
      !Access.canViewModels3DItem()
    ) {

      this.showAccessDenied();

      return;

    }

    const params =
      new URLSearchParams(
        window.location.search
      );

    const id =
      Number(
        params.get("id")
      );

    this.model =
      MODELS.find(
        item =>
          item.id === id
      );

    if (!this.model) {

      window.location.replace(
        "index.html"
      );

      return;

    }

    this.initializeHeader();

    this.renderHeader();

    document
      .getElementById(
        "moduleContent"
      )
      .classList
      .remove("hidden");

  },

  showAccessDenied() {

    document
      .getElementById(
        "accessDenied"
      )
      .classList
      .remove("hidden");

    document
      .getElementById(
        "moduleContent"
      )
      .classList
      .add("hidden");

  },

  initializeHeader() {

    document
      .getElementById(
        "backButton"
      )
      .addEventListener(
        "click",
        () => {

          window.location.assign(
            "index.html"
          );

        }
      );

  },

  renderHeader() {

    document
      .getElementById(
        "contentTitle"
      )
      .textContent =
      this.model.title;

    const author =

      AUTHORS[
        this.model.author
      ] ||

      this.model.author;

    const category =

      CATEGORIES[
        this.model.category
      ] ||

      this.model.category;

    document
      .getElementById(
        "contentInfo"
      )
      .textContent =

      `${category} • ${author} • ${this.model.upd}`;

    document
      .getElementById(
        "contentBody"
      )
      .textContent =

      this.model.description || "";

  }

};

document.addEventListener(

  "DOMContentLoaded",

  () => ModelPage.init()

);