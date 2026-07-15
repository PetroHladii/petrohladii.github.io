import { CONFIG } from "../../config/login-config.js";

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
     * користувача через auth engine
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
     * Обчислюємо permissions
     */

    const permissions =
      getEffectivePermissions(
        auth.user
      );


    /*
     * Обчислюємо Knowledge categories
     */

    const knowledgeCategories =
      getKnowledgeCategories(
        auth.user
      );


    /*
     * Повертаємо frontend-safe user
     */

    return jsonResponse(
      {
        success: true,

        user: {

          email:
            auth.email,

          role:
            auth.user.role,

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