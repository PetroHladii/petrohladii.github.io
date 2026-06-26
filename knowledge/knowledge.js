const Knowledge = {

  articles: [],
  filteredArticles: [],

  async init() {

    console.log("Knowledge module initialized");

    await this.loadData();

    this.renderAuthors();
    this.renderCategories();
    this.renderArticles();

    this.bindEvents();

  },

  async loadData() {

    console.log("Loading Knowledge.csv...");

  },

  renderAuthors() {

    console.log("Render authors");

  },

  renderCategories() {

    console.log("Render categories");

  },

  renderArticles() {

    console.log("Render articles");

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