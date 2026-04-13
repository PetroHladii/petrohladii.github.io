export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // 🔓 ДОЗВОЛЯЄМО ЛОГІН (усі варіанти)
  if (
    path === "/login" ||
    path === "/login.html" ||
    path.startsWith("/login")
  ) {
    return context.next();
  }

  // 🔓 ДОЗВОЛЯЄМО API
  if (path.startsWith("/api")) {
    return context.next();
  }

  // 🔓 ДОЗВОЛЯЄМО СТАТИКУ
  if (/\.(css|js|png|jpg|jpeg|webp|ico|svg)$/.test(path)) {
    return context.next();
  }

  // 🔐 ПЕРЕВІРКА COOKIE
  const cookie = request.headers.get("Cookie") || "";

  if (!cookie.includes("auth=")) {
    return Response.redirect(url.origin + "/login.html", 302);
  }

  return context.next();
}