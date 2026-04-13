export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const path = url.pathname;

  // ✅ дозволяємо логін сторінку
  if (path === "/" || path === "/index.html") {
    return context.next();
  }

  // ✅ дозволяємо API
  if (path.startsWith("/api")) {
    return context.next();
  }

  // ✅ дозволяємо статику
  if (
    path.endsWith(".css") ||
    path.endsWith(".js") ||
    path.endsWith(".png") ||
    path.endsWith(".jpg") ||
    path.endsWith(".webp") ||
    path.endsWith(".ico")
  ) {
    return context.next();
  }

  // 🔐 перевіряємо cookie
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/auth=([^;]+)/);

  if (!match) {
    return new Response("Unauthorized", { status: 401 });
  }

  return context.next();
}