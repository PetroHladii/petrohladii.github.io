const CONFIG = {
  ENV: "test", // "prod" або "test"

  prod: {

    mediaBase:
    "https://media.125.co.ua",

    knowledgeBase:
    "https://media.125.co.ua/knowledge",

    cloudflareWorker:
      "https://old-fog-c80a.tantsa98.workers.dev",

    loginTitle:
      "Вхід - Довідник",

    loginHeader:
      "Вхід",

    indexTitle:
      "Довідник",

    bombersTitle:
      "Бомбери",

    fpvTitle:
      "FPV",

    rozvidkaTitle:
      "Mavic/Autel",

    knowledgeTitle:
    "Знання"
  },

  test: {

    mediaBase:
    "https://media.125.co.ua",

    knowledgeBase:
    "https://media.125.co.ua/knowledge",

    cloudflareWorker:
      "https://silent-sun-7c28.tantsa98.workers.dev",

    loginTitle:
      "Вхід - Довідник (тест)",

    loginHeader:
      "Вхід (тест)",

    indexTitle:
      "Довідник (тест)",

    bombersTitle:
      "Бомбери (тест)",

    fpvTitle:
      "FPV (тест)",

    rozvidkaTitle:
      "Mavic/Autel (тест)",

    knowledgeTitle:
    "Знання (тест)"
  }
};

Object.assign(
  CONFIG,
  CONFIG[CONFIG.ENV]
);