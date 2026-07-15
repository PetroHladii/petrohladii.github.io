import {
  normalizeUserRecord
} from "./access.js";


const SESSION_TTL =
  60 * 60 * 24;


/*
 * Отримуємо KV namespace
 * серверних сесій
 */

export function getSessionStore(
  env,
  config
) {

  const dbName =
    config.sessionsDb;

  if (
    typeof dbName !== "string" ||
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
 * Отримуємо KV namespace
 * користувачів
 */

export function getUsersStore(
  env,
  config
) {

  const dbName =
    config.usersDb;

  if (
    typeof dbName !== "string" ||
    !dbName ||
    !env[dbName]
  ) {

    throw new Error(
      `Users KV binding not found: ${dbName}`
    );

  }

  return env[dbName];

}


/*
 * Читаємо cookie
 */

export function getCookie(
  request,
  name
) {

  if (
    !request ||
    typeof name !== "string" ||
    !name
  ) {

    return null;

  }

  const cookieHeader =
    request.headers.get("Cookie") || "";

  const cookies =
    cookieHeader.split(";");

  for (const cookie of cookies) {

    const separatorIndex =
      cookie.indexOf("=");

    if (
      separatorIndex === -1
    ) {

      continue;

    }

    const cookieName =
      cookie
        .slice(0, separatorIndex)
        .trim();

    if (
      cookieName !== name
    ) {

      continue;

    }

    const cookieValue =
      cookie
        .slice(separatorIndex + 1)
        .trim();

    return cookieValue || null;

  }

  return null;

}


/*
 * Отримуємо session ID
 * з HttpOnly auth cookie
 */

export function getSessionId(
  request
) {

  const sessionId =
    getCookie(
      request,
      "auth"
    );

  if (
    typeof sessionId !== "string" ||
    !sessionId
  ) {

    return null;

  }

  return sessionId;

}


/*
 * Створюємо криптографічно
 * випадковий session ID
 */

export function createSessionId() {

  return crypto.randomUUID();

}


/*
 * Створюємо серверну сесію
 *
 * ВАЖЛИВО:
 * role та permissions
 * у сесії не зберігаємо.
 *
 * Актуальний доступ завжди
 * читається з USERS/USERST.
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

  if (
    typeof email !== "string"
  ) {

    return null;

  }

  const normalizedEmail =
    email
      .toLowerCase()
      .trim();

  if (!normalizedEmail) {

    return null;

  }

  const sessionId =
    createSessionId();

  const createdAt =
    Date.now();

  const expiresAt =
    createdAt +
    SESSION_TTL * 1000;

  const session = {

    email:
      normalizedEmail,

    createdAt,

    expiresAt

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
 * Видаляємо серверну сесію
 * за session ID
 */

export async function deleteSessionById(
  sessionId,
  env,
  config
) {

  if (
    typeof sessionId !== "string" ||
    !sessionId
  ) {

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
    typeof session !== "object" ||
    Array.isArray(session)
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
    !session.email ||
    typeof session.createdAt !== "number" ||
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
    !Number.isFinite(session.createdAt) ||
    !Number.isFinite(session.expiresAt)
  ) {

    await deleteSessionById(
      sessionId,
      env,
      config
    );

    return null;

  }

  if (
    session.createdAt <= 0 ||
    session.expiresAt <= session.createdAt
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
 * SESSIONST/SESSIONS:
 * тільки email та час сесії.
 *
 * USERST/USERS:
 * актуальна роль та доступи.
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

  if (!email) {

    await deleteSessionById(
      session.id,
      env,
      config
    );

    return null;

  }

  const usersStore =
    getUsersStore(
      env,
      config
    );

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
 * Видаляємо поточну
 * серверну сесію
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
 * Створюємо HttpOnly
 * auth cookie
 */

export function createAuthCookie(
  sessionId
) {

  if (
    typeof sessionId !== "string" ||
    !sessionId
  ) {

    throw new Error(
      "Invalid session ID"
    );

  }

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