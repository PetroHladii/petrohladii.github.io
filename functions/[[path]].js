export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // 🔓 дозволяємо логін
  if (path === "/login.html") {
    return context.next();
  }

  // 🔓 дозволяємо API
  if (path.startsWith("/api")) {
    return context.next();
  }

  // 🔓 дозволяємо статику
  if (/\.(css|js|png|jpg|webp|ico)$/.test(path)) {
    return context.next();
  }

  // 🔐 перевіряємо cookie
  const cookie = request.headers.get("Cookie") || "";
  if (!cookie.includes("auth=")) {
    return Response.redirect(url.origin + "/login.html", 302);
  }

  return context.next();
}