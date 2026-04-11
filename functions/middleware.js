export async function onRequest(context) {
  const { request } = context;

  const url = new URL(request.url);

  // ✅ дозволяємо API (логін)
  if (url.pathname.startsWith("/api")) {
    return context.next();
  }

  // ✅ дозволяємо статичні файли
  if (
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".ico")
  ) {
    return context.next();
  }

  // 🍪 беремо cookie
  const cookie = request.headers.get("Cookie") || "";

  const match = cookie.match(/auth=([^;]+)/);

  // ❌ якщо нема cookie → блок
  if (!match) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = match[1];

  try {
    const decoded = atob(token);

    // проста перевірка
    if (!decoded.includes("@")) {
      throw new Error("Invalid token");
    }

  } catch (e) {
    return new Response("Unauthorized", { status: 401 });
  }

  // ✅ все ок — пропускаємо
  return context.next();
}