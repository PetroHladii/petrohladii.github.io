export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // 🔓 1. дозволяємо логін сторінку
  if (path === "/login" || path === "/login.html") {
    return context.next();
  }

  // 🔓 2. дозволяємо API
  if (path.startsWith("/api")) {
    return context.next();
  }

  // 🔓 3. дозволяємо статичні файли
  if (/\.(css|js|png|jpg|webp|ico)$/.test(path)) {
    return context.next();
  }

  // 🔐 4. перевіряємо cookie
  const cookie = request.headers.get("Cookie") || "";

  if (!cookie.includes("auth=")) {
    return Response.redirect(url.origin + "/login.html", 302);
  }

  // 🟢 5. пропускаємо все інше
  return context.next();
}