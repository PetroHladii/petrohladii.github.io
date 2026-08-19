import {
  CONFIG
} from "../../config/login-config.js";

import {
  getAuthenticatedUser
} from "../_lib/auth.js";


function jsonResponse(
  data,
  status = 200
) {

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


export async function onRequestGet(
  context
) {

  const {
    request,
    env
  } = context;

  try {

    /*
     * Перевіряємо
     * авторизованого користувача
     */

    const auth =
      await getAuthenticatedUser(
        request,
        env,
        CONFIG
      );


    if (!auth) {

      return jsonResponse(
        {
          success: false,
          error: "Unauthorized"
        },
        401
      );

    }


    /*
     * Перевіряємо роль
     */

    const allowedRoles = [
      "admin",
      "duty"
    ];


    const role =
      auth.user.role;

    console.log(
    "BK amounts access check:",
    {
        email: auth.email,
        role: auth.user.role,
        active: auth.user.active
    }
    );

    /*
     * Якщо роль не має доступу —
     * не повертаємо дані БК
     */

    if (
      !allowedRoles.includes(
        role
      )
    ) {

      return jsonResponse({
        success: true,

        counts: null
      });

    }


    /*
     * Отримуємо URL
     * існуючого Worker
     */

    const workerUrl =
      env.BK_AMOUNTS_WORKER_URL;


    if (!workerUrl) {

      throw new Error(
        "BK_AMOUNTS_WORKER_URL is not configured"
      );

    }


    /*
     * Запит до Worker
     */

    const workerResponse =
      await fetch(
        workerUrl,
        {
          method: "GET",

          headers: {
            "Cache-Control":
              "no-store"
          }
        }
      );


    if (
      !workerResponse.ok
    ) {

      throw new Error(
        `BK Worker error: ${workerResponse.status}`
      );

    }


    const counts =
      await workerResponse.json();


    /*
     * Повертаємо дані
     * тільки admin / duty
     */

    return jsonResponse({

      success: true,

      counts

    });

  }
  catch (
    error
  ) {

    console.error(
      "api/bk-amounts error:",
      error
    );


    return jsonResponse(
      {
        success: false,

        error:
          "Server error"
      },
      500
    );

  }

}