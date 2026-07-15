import { CONFIG } from "../../config/login-config.js";

import {
  getEffectivePermissions,
  getKnowledgeCategories,
  isValidRole
} from "../_lib/access.js";


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


function jsonResponse(data, status = 200) {

  return new Response(
    JSON.stringify(data),
    {
      status,

      headers: {

        "Content-Type":
          "application/json; charset=utf-8",

        "Cache-Control":
          "no-store"

      }

    }
  );

}


function unauthorized() {

  return jsonResponse(
    {
      success: false,
      error: "Unauthorized"
    },
    401
  );

}


async function deleteSession(
  env,
  sessionId
) {

  try {

    await env[CONFIG.sessionsDb]
      .delete(sessionId);

  }
  catch (error) {

    console.error(
      "Session delete error:",
      error
    );

  }

}


export async function onRequestGet(context) {

  const {
    request,
    env
  } = context;


  /*
   * Отримуємо session ID
   */

  const sessionId =
    getCookie(
      request,
      "auth"
    );

  if (!sessionId) {

    return unauthorized();

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

    return jsonResponse(
      {
        success: false,
        error: "Session service unavailable"
      },
      503
    );

  }


  /*
   * Сесії не існує
   */

  if (!session) {

    return unauthorized();

  }


  /*
   * Перевіряємо структуру сесії
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

    await deleteSession(
      env,
      sessionId
    );

    return unauthorized();

  }


  /*
   * Перевіряємо роль
   */

  if (
    !isValidRole(session.role)
  ) {

    console.error(
      "Invalid session role:",
      session.role
    );

    await deleteSession(
      env,
      sessionId
    );

    return unauthorized();

  }


  /*
   * Перевіряємо термін дії сесії
   */

  if (
    Date.now() >= session.expiresAt
  ) {

    await deleteSession(
      env,
      sessionId
    );

    return unauthorized();

  }


  /*
   * Формуємо user object
   * для access engine
   */

  const user = {

    role:
      session.role,

    active:
      true,

    permissions:
      Array.isArray(session.permissions)
        ? session.permissions
        : [],

    denyPermissions:
      Array.isArray(session.denyPermissions)
        ? session.denyPermissions
        : [],

    knowledge:
      session.knowledge &&
      typeof session.knowledge === "object"
        ? session.knowledge
        : {}

  };


  /*
   * Обчислюємо ефективні permissions
   */

  const permissions =
    getEffectivePermissions(user);


  /*
   * Обчислюємо доступні
   * категорії Knowledge
   */

  const knowledgeCategories =
    getKnowledgeCategories(user);


  /*
   * Відповідь frontend
   */

  return jsonResponse(
    {
      success: true,

      user: {

        email:
          session.email,

        role:
          session.role,

        permissions,

        knowledge: {

          categories:
            knowledgeCategories

        }

      }

    }
  );

}