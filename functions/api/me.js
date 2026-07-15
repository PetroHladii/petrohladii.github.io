import {
  CONFIG
} from "../../config/login-config.js";

import {
  getAuthenticatedUser
} from "../_lib/auth.js";

import {
  getEffectivePermissions,
  getKnowledgeCategories
} from "../_lib/access.js";


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


export async function onRequestGet(context) {

  const {
    request,
    env
  } = context;

  try {

    /*
     * Отримуємо актуального
     * авторизованого користувача
     */

    const authenticated =
      await getAuthenticatedUser(
        request,
        env,
        CONFIG
      );

    if (!authenticated) {

      return jsonResponse(
        {
          success: false,
          error: "Unauthorized"
        },
        401
      );

    }


    /*
     * Актуальні дані користувача
     * вже завантажені з USERS/USERST
     */

    const {
      email,
      user
    } = authenticated;


    /*
     * Обчислюємо ефективні permissions
     */

    const permissions =
      getEffectivePermissions(
        user
      );


    /*
     * Обчислюємо доступні
     * Knowledge categories
     */

    const knowledgeCategories =
      getKnowledgeCategories(
        user
      );


    /*
     * Відповідь frontend
     */

    return jsonResponse(
      {
        success: true,

        user: {

          email,

          role:
            user.role,

          permissions,

          knowledge: {

            categories:
              knowledgeCategories

          }

        }

      }
    );

  }
  catch (error) {

    console.error(
      "Me API error:",
      error
    );

    return jsonResponse(
      {
        success: false,
        error: "Server error"
      },
      500
    );

  }

}