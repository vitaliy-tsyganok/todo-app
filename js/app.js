// Nodes
const addTodoInputNode = document.querySelector('.addTodo__input')
const addTodoButtonNode = document.querySelector('.addTodo__button')

let todos = getToLocalStorage('todos') || []
render()

// Events
addTodoButtonNode.addEventListener('click', addTodoButtonNodeHandler)
addTodoInputNode.addEventListener('keydown', keydownEnter)


// Handlers
function addTodoButtonNodeHandler() {
	addTodo(getTodoText())
	render()
	removeTodoText()
	saveToLocalStorage('todos', todos)
	console.log(todos)
}

function keydownEnter(event) {
	if (event.key === 'Enter') {
		addTodoButtonNodeHandler()
	}
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
function render() {
	let html = ''
	todos.forEach((todo) => {
		html += `<li class="${todo.isDone ? 'isDone' : ''}" data-id="${todo.id}"><div>${todo.todoText}</div>
			<button onClick="setIsDone(this)">Done</button>
			<button onClick="deleteTodo(this)">Delete</button>
		</li>`
	})
	document.querySelector('.todoList').innerHTML = html
}

function addTodo(todoText) {
	if (!todoText) {
		return
	}
	const todo = {
		todoText,
		isDone: false,
		id: `${Math.random()}`,
	}
	todos = [...todos, todo]
}

function deleteTodo(elem) {
	const id = getTodoId(elem)
	todos = todos.filter(todo => todo.id !== id)
	render()
	saveToLocalStorage('todos', todos)
}

function setIsDone(elem) {
	const id = getTodoId(elem)
	todos.forEach(todo => {
		if (todo.id === id) {
			todo.isDone = !todo.isDone
		}
	})
	render()
	saveToLocalStorage('todos', todos)
}

function getTodoId(elem) {
	return elem.parentNode.dataset.id
}

function getTodoText() {
	return addTodoInputNode.value.trim()
}

function removeTodoText() {
	addTodoInputNode.value = ''
}

// Buttons action 
function clearTodosAll() {
	todos = []
	render()
	saveToLocalStorage('todos', todos)
}

function clearTodosDone() {
	todos = todos.filter(todo => !todo.isDone)
	render()
	saveToLocalStorage('todos', todos)
}

function downloadTasks() {
	downloadTasksPromise()
		.then(downloadedTodos => {
			[...downloadedTodos] = downloadedTodos.map(todo => {
				const { id, userId, completed: isDone, title: todoText, } = todo
				return {
					id: `${Math.random()}`,
					isDone,
					todoText,
					todoBody: {
						...todo
					}
				}
			})
			todos = [...todos, ...downloadedTodos]
			console.log(downloadedTodos)
			console.log(todos)
			render()
			saveToLocalStorage('todos', todos)
		})
}

async function downloadTasksPromise() {
	const data = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=7')
	const downloadedTodos = await data.json()
	return downloadedTodos
}



