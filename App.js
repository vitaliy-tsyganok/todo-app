const rootNode = document.querySelector('#root')
const addTodoNode = document.querySelector('#addTodo')
const todoListNode = document.querySelector('#todoList')

const inputNode = addTodoNode.querySelector('input')
const buttonNode = addTodoNode.querySelector('button')

let todos = getToLocalStorage('todos') || []
render()

buttonNode.addEventListener('click', buttonNodeHandler)
inputNode.addEventListener('keydown', keydownEnter)

function buttonNodeHandler() {
	addTodo(getTodoText())
	render()
	removeTodoText()
	saveToLocalStorage('todos', todos)
	console.log(todos)
}

function keydownEnter(event) {
	if (event.key === 'Enter') {
		buttonNodeHandler()
	}
}

function saveToLocalStorage(key, object) {
	localStorage.setItem(key, JSON.stringify(object))
}

function getToLocalStorage(key) {
	return JSON.parse(localStorage.getItem(key))
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
	// todos.push(todo)
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
	return inputNode.value.trim()
}

function removeTodoText() {
	inputNode.value = ''
}

function render() {
	let html = ''
	todos.forEach((todo) => {
		html += `<li class="${todo.isDone ? 'isDone' : ''}" data-id="${todo.id}"><div>${todo.todoText}</div>
			<button onClick="setIsDone(this)">Done</button>
			<button onClick="deleteTodo(this)">Delete</button>
		</li>`
	})
	todoListNode.innerHTML = html
}
