import { CONFIG } from "../../config/login-config.js";

import {
  normalizeUserRecord
} from "../_lib/access.js";


function textResponse(
  message,
  status
) {

  return new Response(
    message,
    {
      status,

      headers: {

        "Content-Type":
          "text/plain; charset=utf-8",

        "Cache-Control":
          "no-store"

      }

    }
  );

}


export async function onRequestPost(context) {

  const {
    request,
    env
  } = context;

  try {

    /*
     * Читаємо request body
     */

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


    /*
     * Перевіряємо вхідні дані
     */

    if (!email || !code) {

      return textResponse(
        "Missing data",
        400
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

      return textResponse(
        "Invalid code",
        401
      );

    }


    /*
     * Завантажуємо користувача
     */

    const userRaw =
      await env[CONFIG.usersDb]
        .get(email);

    if (!userRaw) {

      return textResponse(
        "User not found",
        403
      );

    }


    /*
     * Нормалізуємо користувача
     * через access engine
     */

    const user =
      normalizeUserRecord(userRaw);

    if (!user) {

      console.error(
        "Invalid user configuration:",
        email
      );

      return textResponse(
        "Invalid user configuration",
        403
      );

    }


    /*
     * Перевіряємо active
     */

    if (user.active !== true) {

      return textResponse(
        "User disabled",
        403
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
     * Дані серверної сесії
     */

    const session = {

      email,

      role:
        user.role,

      permissions:
        user.permissions,

      denyPermissions:
        user.denyPermissions,

      knowledge:
        user.knowledge,

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
          expirationTtl:
            sessionTtl
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
            "application/json; charset=utf-8",

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

    return textResponse(
      "Server error",
      500
    );

  }

}