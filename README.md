<h1>Список дел</h1>

Приложение <a href="https://vitaliy-tsyganok.github.io/todo-app/" target="_blank">Todo App</a> разработал на "чистом" JavaScript (Vannila.js) с использованием декларативного подхода.

<h2>История версий</h1>

<h3>2.0.0</h3>

* Получение задач с сервера (по кнопке "Download tasks")
* Синхронизация задач в DOM c localStorage (при обновлении страницы всегда актуальный список задач)
* Отправка задач на сервер (синхронизация сервера, DOM, localstorage)
* Получение списка пользователей с сервера
* Выбор пользователя при добавлении задачи

В качестве сервера используется сервис <a href="https://jsonplaceholder.typicode.com/" target="_blank">JSONPlaceholder</a>

<h3>1.0.0</h3>

* Добавление задачи по кнопке "Add todo"
* Добавление задачи по клавише "Enter"
* Очищение инпута после добавления задачи
* Не добавлять задачу, если поле инпута пустое
* Смена статуса задачи по кнопке "Done"
* Удаление задачи по кнопке "Delete"
* Сохранение задач в localStorage
* Синхронизация задач в localStorage (добавление, смена статуса, удаление)
* Выгрузка задач из localStorage при первоначальном рендеринге
* Работа со стилями
