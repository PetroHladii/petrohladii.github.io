const AUTHORS = {

  bbps: "бБпС",
  "1mb": "1 МБ",
  "2mb": "2 МБ",
  zrdn: "ЗРДн",
  bar: "БАР",
  sadn: "САДн",
  "1tb": "1 ТБ",
  reb: "РЕБ",
  ppo: "ППО",
  brigade: "Бригада"

};

const CATEGORIES = {

  fpv: "FPV",
  bomberh: "Важкі бомбери",
  bomberl: "Легкі бомбери",
  mavic: "Розвідувальні коптери",
  wingrecon: "Розвідувальні крила",
  wingfpv: "Крила FPV камікадзе",
  wingstrike: "Багаторазові ударні крила",
  ppo: "ППО",
  ew: "РЕБ",
  tacmed: "Такмед",
  conceal: "Маскування",
  general: "Загальне",
  a2: "А2 Бот",
  fa: "FA"


};

const KNOWLEDGE = [

  {
    id: 1,
    author: "bbps",
    category: "fpv",
    title: "FPV: Основи",
    contentFile: "1.html",
    files: [
      {
        title: "Антени для FPV дронів",
        file: "fpv_antennas.pdf"
      },
      {
        title: "Будова FPV-дрона і основні компоненти",
        file: "bydova_fpv_osnovni_componenty.pdf"
      },
      {
        title: "Будова FPV дрона",
        file: "bydova_fpv.pdf"
      },
      {
        title: "Основне обладнання",
        file: "main_equipment.pdf"
      },
      {
        title: "Список мастхев інструментів і матеріалів",
        file: "musthave_list.pdf"
      },
      {
        title: "Стіки радіопередавача",
        file: "radio_sticks.pdf"
      }
    ],
    photos: [
      {
        title: "",
        file: ""
      }
    ],
    videos: [
      {
        title: "",
        file: ""
      }
    ],
    updated: "2026-01-01"
  },

  {
    id: 2,
    author: "2mb",
    category: "bomberh",
    title: "Документація VAMPIRE",
    contentFile: "2.html",
    files: [
      {
        title: "Vampire КЛЕ",
        file: "kle_vampire.pdf"
      },
      {
        title: "VAMPIRE Gen3: Рекомендації з налаштування та використання",
        file: "vampire_gen3.pdf"
      }
    ],
    photos: [
      {
        title: "",
        file: ""
      }
    ],
    videos: [
      {
        title: "",
        file: ""
      }        
    ],
    updated: "2026-01-01"
  },

  {
    id: 3,
    author: "bbps",
    category: "bomberh",
    title: "Важкі бомбери: Документація",
    contentFile: "3.html",
    files: [
      {
        title: "Важкі бомбери - шпаргалка",
        file: "heavy_bombers_cheatsheet.pdf"
      },
      {
        title: "Heavy Shot КЛЕ",
        file: "kle_heavy_shot.pdf"
      },
      {
        title: "Nemesis КЛЕ",
        file: "kle_nemesis.pdf"
      },
      {
        title: "Vampire КЛЕ",
        file: "kle_vampire.pdf"
      }
      ,
      {
        title: "ТТХ антенних комплексів",
        file: "antennas_ttc.pdf"
      }
    ],
    photos: [
      {
        title: "",
        file: ""
      }
    ],
    videos: [
      {
        title: "Підготовка БК перед вильотом",
        file: "4b52c7f6b8fdbb18e3717345f9c75797"
      }        
    ],
    updated: "2026-01-01"
  },

  {
    id: 4,
    author: "bbps",
    category: "bomberh",
    title: "Переобладнання Вампіра на R2D2",
    contentFile: "4.html",
    files: [
      {
        title: "",
        file: ""
      }
    ],
    photos: [
      {
        title: "",
        file: ""
      }
    ],
    videos: [
      {
        title: "",
        file: ""
      }        
    ],
    updated: "2026-01-01"
  },

  {
    id: 5,
    author: "bbps",
    category: "mavic",
    title: "Розвідувальні коптери: Основи",
    contentFile: "5.html",
    files: [
      {
        title: "Розвідувальні коптери: Основи",
        file: "recon_copters_base.pdf"
      },
      {
        title: "Настанова Autel Evo Max 4",
        file: "autel_evo_max_manual_v1.pdf"
      },
      {
        title: "Інструкція для операторів Мавіка",
        file: "mavic_operators_instruction.pdf"
      },
      {
        title: "Matrice 4T/4E",
        file: "matrice4te.pdf"
      },
      {
        title: "Додаткове ПЗ: Кропива, Вежа, Діскорд, Мілчат",
        file: "kropyva_vezha_discord_milchat.pdf"
      }
    ],
    photos: [
      
    ],
    videos: [
      {
        title: "Скиди на розвідувальних коптерах",
        file: "bc684d8088b4248edc3b9be77b094be6"
      }      
    ],
    updated: "2026-01-01"
  },

  {
    id: 6,
    author: "brigade",
    category: "a2",
    title: "A2 BOT: Подача доповіді 'Виконане завдання БпЛА'",
    contentFile: "6.html",
    files: [
      {
        title: "Вхід в систему A2 BOT",
        file: "a2_login.pdf"
      },
      {
        title: "А2 Bot: FPV: 'Виконане завдання (БпЛА)'",
        file: "a2_fpv_mission.pdf"
      },
      {
        title: "А2 Bot: Важкий бомбер: 'Виконане завдання (БпЛА)'",
        file: "a2_heavy_bomber_mission.pdf"
      },
      {
        title: "А2 Bot: Ударне крило: 'Виконане завдання (БпЛА)'",
        file: "a2_strike_wing_mission.pdf"
      },
      {
        title: "А2 Bot: Розвідувальний коптер: 'Виконане завдання (БпЛА)'",
        file: "a2_recon_copter_mission.pdf"
      }
    ],
    photos: [
      ],
    videos: [
      {
        title: "Скиди на розвідувальних коптерах",
        file: "bc684d8088b4248edc3b9be77b094be6"
      }      
    ],
    updated: "2026-01-01"
  },

  {
    id: 7,
    author: "brigade",
    category: "a2",
    title: "A2 BOT: Подача доповіді 'Втрата БпЛА'",
    contentFile: "7.html",
    files: [
      {
        title: "Вхід в систему A2 BOT",
        file: "a2_login.pdf"
      },
      {
        title: "А2 Bot: Важкий бомбер: 'Втрата (БпЛА)'",
        file: "a2_heavy_bomber_loss.pdf"
      },
      {
        title: "А2 Bot: Розвідувальне крило: 'Втрата (БпЛА)'",
        file: "a2_recon_wing_loss.pdf"
      },
      {
        title: "А2 Bot: Розвідувальний коптер: 'Втрата (БпЛА)'",
        file: "a2_recon_copter_loss.pdf"
      }
    ],
    photos: [ 
    ],
    videos: [
      {
        title: "Скиди на розвідувальних коптерах",
        file: "bc684d8088b4248edc3b9be77b094be6"
      }      
    ],
    updated: "2026-01-01"
  },

  {
    id: 8,
    author: "brigade",
    category: "fa",
    title: "FA: Верифікація",
    contentFile: "8.html",
    files: [
      {
        title: "Вхід в систему FA",
        file: "fa_login.pdf"
      },
      {
        title: "FA: Вхід та верифікація події 'Виконане завдання БпЛА'",
        file: "fa_login_flight_verification.pdf"
      }
    ],
    photos: [
    ],
    videos: [
      {
        title: "Скиди на розвідувальних коптерах",
        file: "bc684d8088b4248edc3b9be77b094be6"
      }      
    ],
    updated: "2026-01-01"
  },

  {
    id: 9,
    author: "brigade",
    category: "fa",
    title: "A2 Bot/FA: Резерв",
    contentFile: "9.html",
    files: [
      {
        title: "Вхід в систему A2 BOT",
        file: "a2_login.pdf"
      },
      {
        title: "FA: Вхід та верифікація події 'Втрата БпЛА'",
        file: "fa_login_loss_verification.pdf"
      },
      {
        title: "А2 Bot: Важкий бомбер: 'Втрата (БпЛА)'",
        file: "a2_heavy_bomber_loss_2.pdf"
      },
      {
        title: "А2 Bot: Розвідувальне крило: 'Втрата (БпЛА)'",
        file: "a2_recon_wing_loss_2.pdf"
      },
      {
        title: "А2 Bot: Розвідувальний коптер: 'Втрата (БпЛА)'",
        file: "a2_recon_copter_loss_2.pdf"
      }
    ],
    photos: [ 
    ],
    videos: [
      {
        title: "Скиди на розвідувальних коптерах",
        file: "bc684d8088b4248edc3b9be77b094be6"
      }      
    ],
    updated: "2026-01-01"
  }

];