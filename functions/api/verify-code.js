import { CONFIG } from "../../config/login-config.js";

export async function onRequestPost(context) {

  const { request, env } = context;

  try {

    const body =
      await request.json();

    const email =
      body.email
        ?.toLowerCase()
        .trim();

    const code =
      body.code
        ?.toString()
        .trim();

    if (!email || !code) {

      return new Response(
        "Missing data",
        {
          status: 400
        }
      );

    }

    /*
     * Перевіряємо OTP-код
     */

    const savedCode =
      await env[CONFIG.codesDb]
        .get(email);

    if (
      !savedCode ||
      savedCode !== code
    ) {

      return new Response(
        "Invalid code",
        {
          status: 401
        }
      );

    }

    /*
     * Завантажуємо користувача
     */

    const userRaw =
      await env[CONFIG.usersDb]
        .get(email);

    if (!userRaw) {

      return new Response(
        "User not found",
        {
          status: 403
        }
      );

    }

    let user;

    try {

      user =
        JSON.parse(userRaw);

    }
    catch {

      console.error(
        "Invalid user JSON:",
        email
      );

      return new Response(
        "Invalid user configuration",
        {
          status: 403
        }
      );

    }

    /*
     * Перевіряємо active
     */

    if (user.active !== true) {

      return new Response(
        "User disabled",
        {
          status: 403
        }
      );

    }

    /*
     * Перевіряємо роль
     */

    if (
      !user.role ||
      typeof user.role !== "string"
    ) {

      return new Response(
        "Invalid user role",
        {
          status: 403
        }
      );

    }

    /*
     * Видаляємо використаний OTP
     */

    await env[CONFIG.codesDb]
      .delete(email);

    /*
     * Створюємо випадковий session ID
     */

    const sessionId =
      crypto.randomUUID();

    const createdAt =
      Date.now();

    const sessionTtl =
      86400;

    const expiresAt =
      createdAt +
      sessionTtl * 1000;

    /*
     * Дані сесії
     */

    const session = {

      email,

      role: user.role,

      denyPermissions:
        Array.isArray(user.denyPermissions)
          ? user.denyPermissions
          : [],

      createdAt,

      expiresAt

    };

    /*
     * Зберігаємо сесію
     */

    await env[CONFIG.sessionsDb]
      .put(
        sessionId,
        JSON.stringify(session),
        {
          expirationTtl: sessionTtl
        }
      );

    /*
     * Повертаємо HttpOnly cookie
     */

    return new Response(
      JSON.stringify({
        success: true
      }),
      {
        headers: {

          "Content-Type":
            "application/json",

          "Cache-Control":
            "no-store",

          "Set-Cookie":
            `auth=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${sessionTtl}`

        }
      }
    );

  }
  catch (error) {

    console.error(
      "Verify code error:",
      error
    );

    return new Response(
      "Server error",
      {
        status: 500
      }
    );

  }

}