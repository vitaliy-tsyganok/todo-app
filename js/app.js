// Nodes
const addTodoFormNode = document.querySelector('.addTodo')

let todos = getToLocalStorage('todos') || []
let users = getToLocalStorage('users') || []
renderUsers()
renderTodos()

// Events
addTodoFormNode.addEventListener('submit', addTodoFormNodeHandler)

// Handlers
function addTodoFormNodeHandler(event) {
	event.preventDefault()
	const [todoText, todoUserId] = [getTodoText(), getTodoUserId()]
	addTodo(todoText, todoUserId)
	removeTodoText()
	addTodoFormNode.input.focus()
	saveToLocalStorage('todos', todos)
	saveToLocalStorage('users', users)
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
	let html = '<option value="" disabled selected>Select user</option>'
	downloadUsers()
		.then(() => {
			users.forEach((user) => {
				html += `<option value="${user.id}">${user.name}</option>`
			})
		})
		.then(() => {
			console.log('Users downloaded', users)
			document.querySelector('.addTodo__selectUser').innerHTML = html
		})
}

function renderTodos() {
	let html = ''
	todos.forEach((todo) => {
		html += `<li class="${todo.isDone ? 'isDone' : ''}" data-front_id="${
			todo.front_id
		}"><div>${todo.todoText} <i>by ${getUser(todo.userId)?.name}</i></div>
			<button onClick="setIsDone(this)">Done</button>
			<button onClick="deleteTodo(this)">Delete</button>
		</li>`
	})
	document.querySelector('.todoList').innerHTML = html
}

async function addTodo(todoText, userId) {
	const todo = {
		todoText,
		userId,
		isDone: false,
		front_id: `${Math.random()}`,
	}
	const newTodo = await createTodo(todo)
	changeTodos([...todos, newTodo])
	renderTodos()
}

function deleteTodo(elem) {
	const front_id = getTodoFrontId(elem)
	changeTodos(todos.filter((todo) => todo.front_id !== front_id))
	renderTodos()
	saveToLocalStorage('todos', todos)
}

function setIsDone(elem) {
	const front_id = getTodoFrontId(elem)
	todos.forEach((todo) => {
		if (todo.front_id === front_id) {
			todo.isDone = !todo.isDone
		}
	})
	renderTodos()
	saveToLocalStorage('todos', todos)
}

function getTodoFrontId(elem) {
	return elem.parentNode.dataset.front_id
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

function changeTodos(changedTodos) {
	todos = changedTodos
}

function changeUsers(changedUsers) {
	users = changedUsers
}

// Buttons action
function clearTodosAll() {
	changeTodos([])
	renderTodos()
	saveToLocalStorage('todos', todos)
}

function clearTodosDone() {
	changeTodos(todos.filter((todo) => !todo.isDone))
	renderTodos()
	saveToLocalStorage('todos', todos)
}

function downloadTasks() {
	downloadTasksPromise().then((downloadedTodos) => {
		;[...downloadedTodos] = downloadedTodos.map((todo) => {
			const { completed: isDone, title: todoText } = todo
			return {
				...todo,
				front_id: `${Math.random()}`,
				isDone,
				todoText,
			}
		})
		changeTodos([...todos, ...downloadedTodos])
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
	changeUsers([...downloadedUsers])
}

async function createTodo(todo) {
	const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
		method: 'POST',
		body: JSON.stringify(todo),
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
	})
	const newTodo = await response.json()
	console.log(newTodo)
	return newTodo
}
