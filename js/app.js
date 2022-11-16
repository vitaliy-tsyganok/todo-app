// Nodes
const addTodoFormNode = document.querySelector('.addTodo')

let todos = getToLocalStorage('todos') || []
let users = getToLocalStorage('users') || []
renderUsers()
renderTodos()

// Events
addTodoFormNode.addEventListener('submit', addTodoFormNodeHandler)
// addTodoFormNode.input.addEventListener('keydown', keydownEnter)

// Handlers
function addTodoFormNodeHandler(event) {
	event.preventDefault()
	// validateForm(addTodoFormNode)
	const [todoText, todoUserId] = [getTodoText(), getTodoUserId()]
	if (!todoText || !todoUserId) {
		return alert('Please select user')
	}
	addTodo(todoText, todoUserId)
	renderTodos()
	removeTodoText()
	addTodoFormNode.input.focus()
	saveToLocalStorage('todos', todos)
	saveToLocalStorage('users', users)
	console.log(todos)
}

// Functions
// Local storage
function saveToLocalStorage(key, object) {
	localStorage.setItem(key, JSON.stringify(object))
}

function getToLocalStorage(key) {
	return JSON.parse(localStorage.getItem(key))
}

// Basic functions
function renderUsers() {
	let html = '<option value="">Select user</option>'
	downloadUsers()
		.then(() => {
			users.forEach((user) => {
				html += `<option value="${user.id}">${user.name}</option>`
			})
		})
		.then(() => {
			console.log(users)
			document.querySelector('.addTodo__selectUser').innerHTML = html
		})
}

function renderTodos() {
	let html = ''
	// console.log('renderTodos', users)
	todos.forEach((todo) => {
		html += `<li class="${todo.isDone ? 'isDone' : ''}" data-id="${
			todo.id
		}"><div>${todo.todoText} <i>by ${
			getUser(todo.todoBody.userId)?.name
		}</i></div>
			<button onClick="setIsDone(this)">Done</button>
			<button onClick="deleteTodo(this)">Delete</button>
		</li>`
	})
	document.querySelector('.todoList').innerHTML = html
}

function addTodo(todoText, userId) {
	const todo = {
		todoText,
		isDone: false,
		id: `${Math.random()}`,
		todoBody: {
			userId,
		},
	}
	todos = [...todos, todo]
}

function deleteTodo(elem) {
	const id = getTodoId(elem)
	todos = todos.filter((todo) => todo.id !== id)
	renderTodos()
	saveToLocalStorage('todos', todos)
}

function setIsDone(elem) {
	const id = getTodoId(elem)
	todos.forEach((todo) => {
		if (todo.id === id) {
			todo.isDone = !todo.isDone
		}
	})
	renderTodos()
	saveToLocalStorage('todos', todos)
}

function getTodoId(elem) {
	return elem.parentNode.dataset.id
}

function getTodoText() {
	return addTodoFormNode.input.value.trim()
}

function getTodoUserId() {
	return Number(addTodoFormNode.selectUser.value)
}

function getUser(userId) {
	return users.find((user) => user.id === userId)
}

function removeTodoText() {
	addTodoFormNode.input.value = ''
}

// Buttons action
function clearTodosAll() {
	todos = []
	renderTodos()
	saveToLocalStorage('todos', todos)
}

function clearTodosDone() {
	todos = todos.filter((todo) => !todo.isDone)
	renderTodos()
	saveToLocalStorage('todos', todos)
}

function downloadTasks() {
	downloadTasksPromise().then((downloadedTodos) => {
		;[...downloadedTodos] = downloadedTodos.map((todo) => {
			const { completed: isDone, title: todoText } = todo
			return {
				id: `${Math.random()}`,
				isDone,
				todoText,
				todoBody: {
					...todo,
				},
			}
		})
		todos = [...todos, ...downloadedTodos]
		renderTodos()
		saveToLocalStorage('todos', todos)
	})
}

async function downloadTasksPromise() {
	const data = await fetch(
		'https://jsonplaceholder.typicode.com/todos?_limit=7'
	)
	const downloadedTodos = await data.json()
	return downloadedTodos
}

async function downloadUsers() {
	const data = await fetch(
		'https://jsonplaceholder.typicode.com/users?_limit=7'
	)
	const downloadedUsers = await data.json()
	users = [...downloadedUsers]
}
