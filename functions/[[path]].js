export async function onRequest(context) {
  const { request } = context;

  const url = new URL(request.url);

  console.log("MIDDLEWARE HIT:", url.pathname);

  // API не чіпаємо
  if (url.pathname.startsWith("/api")) {
    return context.next();
  }

  // статика
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

  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/auth=([^;]+)/);

  if (!match) {
    console.log("NO COOKIE");
    return new Response("Unauthorized", { status: 401 });
  }

  console.log("COOKIE OK");

  return context.next();
}