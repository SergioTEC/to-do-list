import {
  addCounter,
  subtractCounter,
  addCompletedTaskCount,
  subtractCompletedTaskCount,
  updateCounter,
} from './counter.js'

export { taskCountTxt }

const inputText = document.querySelector('.input-text')
const create = document.querySelector('.create')
const taskList = document.querySelector('.task-list')
const taskCountTxt = document.querySelector('.task-count-txt')
const url = 'http://localhost:3000/tasks'

// Task creation event
create.addEventListener('click', handleTaskCreation)

function fetchDataFromDataBase() {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao obter tarefas do banco de dados')
        }
        return response.json()
      })
      .then((data) => {
        console.log('Tarefas obtidas com sucesso:', data)
        data.forEach((taskData) => {
          createTaskItem(taskData)
        })
      })
      .catch((error) => {
        console.error('Erro:', error.message)
      })
  })
}

fetchDataFromDataBase()

function handleTaskCreation() {
  const taskText = inputText.value.trim()

  if (taskText !== '') {
    // Build the task object to send to the backend
    const taskData = { text: taskText, strikethrough: false }

    // Send a POST request to the backend
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erro ao adicionar nova tarefa ao banco de dados')
        }
        return response.json()
      })
      .then((taskData) => {
        createTaskItem(taskData)
      })
      .catch((error) => {
        console.error('Erro:', error.message)
        subtractCounter(taskCountTxt)
      })
    inputText.value = ''
  } else {
    window.alert('Verifique se foi digitado algo em "Adicione uma nova tarefa')
  }
}

// Function to update a task on database
function updateTask(taskId, taskData) {
  fetch(`${url}/${taskId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erro ao atualizar a tarefa no banco de dados')
      }
      return response.json()
    })
    .then((updateTask) => {
      console.log('Tarefa atualizada com sucesso:', updateTask)
    })
    .catch((error) => {
      console.error('Erro:', error.message)
    })
}

// Function to delete a task on database
function deleteTask(taskId) {
  fetch(`${url}/${taskId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erro ao excluir a tarefa no banco de dados')
      }
      return response.json()
    })
    .then((deleteTask) => {
      console.log('Tarefa excluída com sucesso:', deleteTask)
    })
    .catch((error) => {
      console.error('Erro:', error.message)
    })
}

function createTaskItem(taskData) {
  // Creating the task list
  const taskItem = document.createElement('li')
  taskItem.className = 'task-item'

  // Creating items for a task
  const checkbox = createCheckbox()
  const editButton = createButton('edit-button', 'Edit', 'edit_icon.png')
  const taskTextElement = createTextElement('span', taskData.text)
  const deleteButton = createButton('delete-button', 'Delete', 'trash_icon.png')

  taskItem.appendChild(checkbox)
  taskItem.appendChild(editButton)
  taskItem.appendChild(taskTextElement)
  taskItem.appendChild(deleteButton)

  // Stores the reference to the corresponding checkbox
  const checkboxRef = checkbox

  // Creating events for task items
  editButton.addEventListener('click', () =>
    handleEditTask(taskItem, taskTextElement, checkboxRef, taskData.id),
  )
  deleteButton.addEventListener('click', () =>
    handleDeleteTask(taskItem, checkboxRef, taskData.id),
  )
  checkbox.addEventListener('change', () =>
    handleCheckboxChange(checkbox, taskItem, taskData.id),
  )

  if (taskData.strikethrough === 1) {
    taskTextElement.style.textDecoration = 'line-through'
    taskTextElement.style.color = '#40B87B'
    checkbox.checked = true
    addCompletedTaskCount()
  }

  taskList.appendChild(taskItem)
  addCounter(taskCountTxt)
}

function createCheckbox() {
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'checkbox'
  return checkbox
}

function createButton(className, altText, iconSrc) {
  const button = document.createElement('button')
  button.className = className
  const icon = document.createElement('img')
  icon.src = `/public/assets/${iconSrc}`
  icon.alt = altText
  button.appendChild(icon)
  return button
}

function createTextElement(elementType, textContent) {
  const element = document.createElement(elementType)
  element.textContent = textContent
  return element
}

function handleEditTask(taskItem, taskTextElement, checkboxRef, taskId) {
  const taskText = taskTextElement.textContent
  const editInput = createInput('text', taskText)
  const saveButton = createButton('save-button', 'Save Edit', 'save_icon.png')
  const cancelButton = createButton(
    'cancel-button',
    'Cancel Edit',
    'cancel_icon.png',
  )

  taskTextElement.replaceWith(editInput)
  taskItem.appendChild(saveButton)
  taskItem.appendChild(cancelButton)

  saveButton.addEventListener('click', () =>
    handleSaveText(
      editInput,
      taskTextElement,
      checkboxRef,
      saveButton,
      cancelButton,
      taskId,
    ),
  )
  cancelButton.addEventListener('click', () =>
    handleCancelEdit(
      editInput,
      taskTextElement,
      taskItem,
      saveButton,
      cancelButton,
    ),
  )
}

function createInput(type, value) {
  const input = document.createElement('input')
  input.type = type
  input.value = value
  input.className = 'input-edit-text'
  return input
}

function handleSaveText(
  editInput,
  taskTextElement,
  checkboxRef,
  saveButton,
  cancelButton,
  taskId,
) {
  const editedText = editInput.value
  const isCheckboxChecked = checkboxRef.checked
  taskTextElement.textContent = editedText
  saveButton.remove()
  cancelButton.remove()
  editInput.replaceWith(taskTextElement)

  updateTask(taskId, { text: editedText, strikethrough: isCheckboxChecked })
}

function handleCancelEdit(
  editInput,
  taskTextElement,
  taskItem,
  saveButton,
  cancelButton,
) {
  const cancelEditRes = confirm('Deseja descartar a edição da tarefa?')
  if (cancelEditRes) {
    editInput.replaceWith(taskTextElement)
    saveButton.remove()
    cancelButton.remove()
  }
}

function handleDeleteTask(taskItem, checkboxRef, taskId) {
  const deleteTaskRes = confirm('Deseja deletar a tarefa?')
  if (deleteTaskRes) {
    taskList.removeChild(taskItem)
    subtractCounter(taskCountTxt)
    deleteTask(taskId)
  }
  if (checkboxRef.checked) {
    subtractCompletedTaskCount()
  }
}

function handleCheckboxChange(checkbox, taskItem, taskId) {
  if (taskId) {
    // Gets the task text corresponding to the span element
    const taskTextElement = taskItem.querySelector('span')
    const editedText = taskTextElement.textContent

    if (checkbox.checked) {
      taskTextElement.style.textDecoration = 'line-through'
      taskTextElement.style.color = '#40B87B'
      addCompletedTaskCount()
    } else {
      taskTextElement.style.textDecoration = 'none'
      taskTextElement.style.color = '#E6E7E8'
      subtractCompletedTaskCount()
    }

    updateTask(taskId, { text: editedText, strikethrough: checkbox.checked })
  } else {
    console.error('ID da tarefa não está definida')
  }
}
