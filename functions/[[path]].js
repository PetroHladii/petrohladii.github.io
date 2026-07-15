import { CONFIG } from "../config/login-config.js";

function getCookie(request, name) {

  const cookieHeader =
    request.headers.get("Cookie") || "";

  const cookies =
    cookieHeader.split(";");

  for (const cookie of cookies) {

    const [cookieName, ...valueParts] =
      cookie.trim().split("=");

    if (cookieName === name) {

      return valueParts.join("=");

    }

  }

  return null;

}

function redirectToLogin(url) {

  return Response.redirect(
    url.origin + "/login.html",
    302
  );

}

function clearAuthAndRedirect(url) {

  return new Response(
    null,
    {
      status: 302,

      headers: {

        "Location":
          url.origin + "/login.html",

        "Cache-Control":
          "no-store",

        "Set-Cookie":
          "auth=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"

      }

    }
  );

}

export async function onRequest(context) {

  const {
    request,
    env
  } = context;

  const url =
    new URL(request.url);

  const path =
    url.pathname;

  /*
   * Публічні сторінки входу
   */

  if (
    path === "/login" ||
    path === "/login.html"
  ) {

    return context.next();

  }

  /*
   * API обробляють власну логіку доступу
   */

  if (
    path.startsWith("/api/")
  ) {

    return context.next();

  }

  /*
   * Публічна статика
   *
   * На цьому етапі залишаємо поточну
   * логіку без змін.
   */

  if (
    /\.(css|js|png|jpg|jpeg|webp|ico|svg|woff|woff2)$/i
      .test(path)
  ) {

    return context.next();

  }

  /*
   * Отримуємо session ID
   */

  const sessionId =
    getCookie(
      request,
      "auth"
    );

  if (!sessionId) {

    return redirectToLogin(url);

  }

  /*
   * Отримуємо серверну сесію
   */

  let session;

  try {

    session =
      await env[CONFIG.sessionsDb]
        .get(
          sessionId,
          {
            type: "json"
          }
        );

  }
  catch (error) {

    console.error(
      "Session read error:",
      error
    );

    return new Response(
      "Session service unavailable",
      {
        status: 503,

        headers: {

          "Cache-Control":
            "no-store"

        }

      }
    );

  }

  /*
   * Сесії не існує
   */

  if (!session) {

    return clearAuthAndRedirect(url);

  }

  /*
   * Перевірка структури сесії
   */

  if (
    typeof session !== "object" ||
    typeof session.email !== "string" ||
    typeof session.role !== "string" ||
    typeof session.expiresAt !== "number"
  ) {

    console.error(
      "Invalid session structure:",
      sessionId
    );

    try {

      await env[CONFIG.sessionsDb]
        .delete(sessionId);

    }
    catch (error) {

      console.error(
        "Invalid session delete error:",
        error
      );

    }

    return clearAuthAndRedirect(url);

  }

  /*
   * Перевірка завершення сесії
   */

  if (
    Date.now() >= session.expiresAt
  ) {

    try {

      await env[CONFIG.sessionsDb]
        .delete(sessionId);

    }
    catch (error) {

      console.error(
        "Expired session delete error:",
        error
      );

    }

    return clearAuthAndRedirect(url);

  }

  /*
   * Сесія валідна
   */

  return context.next();

}