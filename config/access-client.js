const Access = {

  initialized: false,

  loadingPromise: null,

  user: null,


  async init() {

    if (this.initialized) {

      return this.user;

    }

    if (this.loadingPromise) {

      return this.loadingPromise;

    }

    this.loadingPromise =
      (async () => {

        const response =
          await fetch(
            "/api/me",
            {
              cache: "no-store",
              credentials: "same-origin"
            }
          );

        if (!response.ok) {

          this.reset();

          window.location.replace(
            "/login.html"
          );

          return null;

        }

        const data =
          await response.json();

        if (
          !data.success ||
          !data.user
        ) {

          this.reset();

          window.location.replace(
            "/login.html"
          );

          return null;

        }

        this.user =
          data.user;

        this.initialized =
          true;

        this.loadingPromise =
          null;

        return this.user;

      })();

    return this.loadingPromise;

  },


  async ready() {

    return this.init();

  },


  hasPermission(
    permission
  ) {

    if (!this.user) {

      return false;

    }

    const permissions =
      this.user.permissions || [];

    return (

      permissions.includes("*") ||

      permissions.includes(permission)

    );

  },


  hasAnyPermission(
    permissions
  ) {

    return permissions.some(
      permission =>
        this.hasPermission(
          permission
        )
    );

  },


  hasAllPermissions(
    permissions
  ) {

    return permissions.every(
      permission =>
        this.hasPermission(
          permission
        )
    );

  },


  canAccessCategory(
    category
  ) {

    if (!this.user) {

      return false;

    }

    const categories =
      this.user
        .knowledge
        ?.categories;

    if (
      categories === "*"
    ) {

      return true;

    }

    if (
      !Array.isArray(
        categories
      )
    ) {

      return false;

    }

    return categories.includes(
      category
    );

  },


  isAdmin() {

    return (
      this.user?.role ===
      "admin"
    );

  },


  isDuty() {

    return (
      this.user?.role ===
      "duty"
    );

  },


  isUser() {

    return (
      this.user?.role ===
      "user"
    );

  },


  isGuest() {

    return (
      this.user?.role ===
      "guest"
    );

  },


  async logout() {

    try {

      await fetch(
        "/api/logout",
        {
          method: "POST",
          credentials: "same-origin"
        }
      );

    }
    finally {

      this.reset();

      window.location.replace(
        "/login.html"
      );

    }

  },


  reset() {

    this.user = null;

    this.initialized = false;

    this.loadingPromise = null;

  }

};

Object.freeze(
  Access
);

window.Access = Access;