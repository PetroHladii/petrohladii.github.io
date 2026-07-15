import {
  normalizeUserRecord
} from "./access.js";


const SESSION_TTL =
  60 * 60 * 24;


/*
 * Отримуємо KV namespace
 * для серверних сесій
 */

export function getSessionStore(
  env,
  config
) {

  const dbName =
    config.sessionsDb;

  if (
    !dbName ||
    !env[dbName]
  ) {

    throw new Error(
      `Session KV binding not found: ${dbName}`
    );

  }

  return env[dbName];

}


/*
 * Отримуємо cookie
 */

export function getCookie(
  request,
  name
) {

  const cookieHeader =
    request.headers.get("Cookie") || "";

  const cookies =
    cookieHeader.split(";");

  for (const cookie of cookies) {

    const separatorIndex =
      cookie.indexOf("=");

    if (separatorIndex === -1) {

      continue;

    }

    const cookieName =
      cookie
        .slice(0, separatorIndex)
        .trim();

    if (cookieName !== name) {

      continue;

    }

    return cookie
      .slice(separatorIndex + 1)
      .trim();

  }

  return null;

}


/*
 * Отримуємо session ID
 * з auth cookie
 */

export function getSessionId(
  request
) {

  return getCookie(
    request,
    "auth"
  );

}


/*
 * Створюємо випадковий
 * session ID
 */

export function createSessionId() {

  return crypto.randomUUID();

}


/*
 * Створюємо серверну сесію
 */

export async function createSession(
  env,
  config,
  email,
  user
) {

  const normalizedUser =
    normalizeUserRecord(user);

  if (
    !normalizedUser ||
    normalizedUser.active !== true
  ) {

    return null;

  }

  const sessionId =
    createSessionId();

  const now =
    Date.now();

  const session = {

    email:
      email
        .toLowerCase()
        .trim(),

    createdAt:
      now,

    expiresAt:
      now + SESSION_TTL * 1000

  };

  const sessionStore =
    getSessionStore(
      env,
      config
    );

  await sessionStore.put(

    sessionId,

    JSON.stringify(session),

    {
      expirationTtl:
        SESSION_TTL
    }

  );

  return {

    id:
      sessionId,

    data:
      session

  };

}


/*
 * Отримуємо та перевіряємо
 * серверну сесію
 */

export async function getSession(
  request,
  env,
  config
) {

  const sessionId =
    getSessionId(request);

  if (!sessionId) {

    return null;

  }

  const sessionStore =
    getSessionStore(
      env,
      config
    );

  const rawSession =
    await sessionStore.get(
      sessionId
    );

  if (!rawSession) {

    return null;

  }

  let session;

  try {

    session =
      JSON.parse(rawSession);

  }
  catch {

    await deleteSessionById(
      sessionId,
      env,
      config
    );

    return null;

  }

  if (
    !session ||
    typeof session !== "object"
  ) {

    await deleteSessionById(
      sessionId,
      env,
      config
    );

    return null;

  }

  if (
    typeof session.email !== "string" ||
    typeof session.expiresAt !== "number"
  ) {

    await deleteSessionById(
      sessionId,
      env,
      config
    );

    return null;

  }

  if (
    Date.now() >= session.expiresAt
  ) {

    await deleteSessionById(
      sessionId,
      env,
      config
    );

    return null;

  }

  return {

    id:
      sessionId,

    data:
      session

  };

}


/*
 * Отримуємо актуального
 * авторизованого користувача
 *
 * ВАЖЛИВО:
 * роль та permissions читаються
 * з USERS/USERST при кожному запиті
 */

export async function getAuthenticatedUser(
  request,
  env,
  config
) {

  const session =
    await getSession(
      request,
      env,
      config
    );

  if (!session) {

    return null;

  }

  const email =
    session.data.email
      .toLowerCase()
      .trim();

  const usersStore =
    env[config.usersDb];

  if (!usersStore) {

    throw new Error(
      `Users KV binding not found: ${config.usersDb}`
    );

  }

  const rawUser =
    await usersStore.get(
      email
    );

  const user =
    normalizeUserRecord(
      rawUser
    );

  if (
    !user ||
    user.active !== true
  ) {

    await deleteSessionById(
      session.id,
      env,
      config
    );

    return null;

  }

  return {

    sessionId:
      session.id,

    email,

    user

  };

}


/*
 * Видаляємо сесію
 * за session ID
 */

export async function deleteSessionById(
  sessionId,
  env,
  config
) {

  if (!sessionId) {

    return;

  }

  const sessionStore =
    getSessionStore(
      env,
      config
    );

  await sessionStore.delete(
    sessionId
  );

}


/*
 * Видаляємо поточну сесію
 */

export async function deleteSession(
  request,
  env,
  config
) {

  const sessionId =
    getSessionId(request);

  if (!sessionId) {

    return;

  }

  await deleteSessionById(
    sessionId,
    env,
    config
  );

}


/*
 * Створюємо auth cookie
 */

export function createAuthCookie(
  sessionId
) {

  return [
    `auth=${sessionId}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    `Max-Age=${SESSION_TTL}`
  ].join("; ");

}


/*
 * Видаляємо auth cookie
 */

export function createExpiredAuthCookie() {

  return [
    "auth=",
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    "Max-Age=0"
  ].join("; ");

}