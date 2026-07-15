import { CONFIG } from "../../config/login-config.js";

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

export async function onRequestPost(context) {

  const { request, env } = context;

  try {

    /*
     * Отримуємо session ID з cookie
     */

    const sessionId =
      getCookie(request, "auth");

    /*
     * Видаляємо серверну сесію
     */

    if (sessionId) {

      await env[CONFIG.sessionsDb]
        .delete(sessionId);

    }

    /*
     * Видаляємо cookie у браузері
     */

    return new Response(
      "OK",
      {
        headers: {

          "Cache-Control":
            "no-store",

          "Set-Cookie":
            "auth=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"

        }
      }
    );

  }
  catch (error) {

    console.error(
      "Logout error:",
      error
    );

    /*
     * Навіть якщо KV тимчасово недоступний,
     * локальну cookie все одно видаляємо
     */

    return new Response(
      "OK",
      {
        headers: {

          "Cache-Control":
            "no-store",

          "Set-Cookie":
            "auth=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"

        }
      }
    );

  }

}