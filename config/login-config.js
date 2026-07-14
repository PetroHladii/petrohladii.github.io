export const CONFIG = {
  ENV: "test" // альбо "prod" альбо "test"
};

CONFIG.codesDb =
  CONFIG.ENV === "prod"
    ? "CODES"
    : "CODEST";

CONFIG.usersDb =
  CONFIG.ENV === "prod"
    ? "USERS"
    : "USERST";

CONFIG.sessionsDb =
  CONFIG.ENV === "prod"
    ? "SESSIONS"
    : "SESSIONST";

CONFIG.mailSender =
  CONFIG.ENV === "prod"
    ? "noreply@mail.125.co.ua"
    : "testnoreply@mail.125.co.ua";