# Architecture

Version: 1.0  
Status: Active  
Owner: Петро

---

# 1. Project Overview

Проєкт є єдиним веб-застосунком "Довідник".

Всі функціональні можливості реалізуються у вигляді окремих модулів.

На даний момент реалізуються модулі:

- BK
- Knowledge

У майбутньому можуть бути додані:

- Статути
- Документи
- Карти
- Навчання
- Накази
- Новини

Кожен модуль є незалежним та не повинен впливати на роботу інших модулів.

---

# 2. Folder Structure

```
/
│
├── bk/
│
├── knowledge/
│
├── config/
│   ├── env-config.js
│   └── config.js
│
├── css/
│
├── data/
│   ├── bk/
│   └── knowledge/
│
├── functions/
│
├── Architecture.md
│
└── index.html
```

---

# 3. Configuration

Вся конфігурація знаходиться лише у папці

```
config/
```

## env-config.js

Містить лише змінні середовища.

Наприклад

- TEST
- PROD
- Worker URL
- R2 URL
- Stream URL

Ніяких інших констант.

---

## config.js

Містить усі константи сайту.

Наприклад

- назви сторінок
- словники
- авторів
- категорії
- інші загальні налаштування

---

# 4. Data Storage

Всі дані зберігаються окремо від коду.

```
data/
```

## BK

```
data/bk/BK.csv
```

## Knowledge

```
data/knowledge/Knowledge.csv
```

---

# 5. Knowledge CSV

Структура

```
Id
Author
Category
Title
Files
Photos
Videos
```

Правила

Id — унікальний

Author — ID автора

Category — ID категорії

Title — назва статті

Files — список PDF

Photos — список фотографій

Videos — список Stream ID

Роздільник списків

```
;
```

Наприклад

```
doc1.pdf;doc2.pdf;doc3.pdf
```

---

# 6. Markdown

Всі тексти статей знаходяться окремо.

```
knowledge/

    text/

        1.md

        2.md

        3.md
```

Ім'я markdown завжди відповідає Id статті.

```
Id = 15

↓

15.md
```

---

# 7. Cloudflare R2

Всі медіа знаходяться в R2.

Структура

```
knowledge/

    1/

        photo1.webp

        photo2.jpg

        manual.pdf

    2/

        ...
```

Папка завжди має назву Id статті.

---

# 8. Stream

Videos містять Cloudflare Stream ID.

Не назву файлу.

Не URL.

Лише Stream ID.

---

# 9. Dictionaries

CSV використовує лише ID.

Наприклад

Author

```
usb
```

Category

```
ew
```

Відображення користувачу здійснюється через словники config.js.

---

# 10. Routing

Головна сторінка

```
knowledge/index.html
```

Стаття

```
knowledge/article.html?id=15
```

Єдиний ідентифікатор статті — Id.

---

# 11. Search

Пошук працює по

- Title
- Category

---

# 12. Filters

Фільтри

- Author
- Category

Працюють одночасно.

Якщо нічого не вибрано —

вважається

"Усі".

---

# 13. Article Layout

Структура сторінки

```
Назад

Заголовок

Автор

Категорія

Markdown

Фото

PDF

Відео
```

Порожні секції не відображаються.

---

# 14. Gallery

Фото відображаються плиткою (Tile Gallery).

При натисканні відкривається Popup.

Підтримується

- Swipe
- Keyboard
- Lazy Loading
- Fullscreen

---

# 15. PDF

PDF відкриваються через Popup.

Вбудований Viewer.

Не відкриваються в новій вкладці.

---

# 16. Video

Використовується Cloudflare Stream.

Єдиний Video Player для всіх модулів.

---

# 17. Responsive Design

Проєкт розробляється за принципом

Mobile First.

Основні breakpoints

```
0–767

768–1199

1200+
```

Всі нові сторінки повинні однаково працювати

- телефон
- планшет
- ноутбук
- FullHD
- 2K
- 4K

Не використовувати фіксовані ширини.

Перевага

- Flex
- Grid
- clamp()
- min()
- max()

---

# 18. Cache

Використовується

sessionStorage

Кешуються

- Knowledge.csv
- Markdown

Не кешуються

- Фото
- PDF
- Відео

Їх кешує браузер.

---

# 19. Components

Не створювати універсальні компоненти наперед.

Використовується правило

Rule of Two

Якщо код використовується мінімум у двох місцях —

виноситься в окремий компонент.

---

# 20. Design System

Всі модулі використовують одну дизайн-систему.

Спільні

- кольори
- кнопки
- popup
- hover
- анімації
- відступи
- типографіка

---

# 21. Naming Convention

CSV

camelCase не використовується.

Назви колонок

```
Id

Author

Category

Title

Files

Photos

Videos
```

Автори

```
usb

2mb

hq
```

Категорії

```
ew

fpv

tacmed

mavic

bombers
```

Тільки нижній регістр.

---

# 22. Development Rules

Весь код повинен бути максимально модульним.

Конфігурація не повинна дублюватися.

Медіа не повинні дублюватися.

Дані не повинні дублюватися.

Всі нові функції повинні відповідати Architecture.md.

---

# 23. Future Development

Планується додавання

- Закладки
- Історія перегляду
- Останні статті
- Пов'язані статті
- Популярні статті
- Нові модулі
- Покращення пошуку
- Індексація Markdown