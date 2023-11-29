import {
  addCounter,
  subtractCounter,
  addCompletedTaskCount,
  subtractCompletedTaskCount,
  updateCounter
} from './counter.js'

export { 
  taskCountTxt,
}

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
      .then(response => {
        if(!response.ok) {
          throw new Error('Erro ao obter tarefas do banco de dados')
        }
        return response.json()
      })
      .then(data => {
        console.log('Tarefas obtidas com sucesso:', data)
        data.forEach(taskData => createTaskItem(taskData))
      })
      .catch(error => {
        console.error('Erro:', error.message)
      })
  })
}

fetchDataFromDataBase()

function handleTaskCreation() {
  const taskText = inputText.value.trim()

  if (taskText !== '') {
    addCounter(taskCountTxt)

    // Build the task object to send to the backend
    const taskData = { text: taskText, strikethrough: false }

    // Send a POST request to the backend
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao adicionar nova tarefa ao banco de dados')
        }
        return response.json()
      })
      .then(taskData => {
        createTaskItem(taskData)
        taskList.innerHTML = '';
        fetchDataFromDataBase()
      })
      .catch(error => {
        console.error('Erro:', error.message)
        subtractCounter(taskCountTxt)
      })
    inputText.value = ''

  } else {
    window.alert('Verifique se foi digitado algo em "Adicione uma nova tarefa')
  }
}

// Function to update a task on database
function updateTask(taskCod, taskData) {
  fetch(`${url}/${taskCod}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao atualizar a tarefa no banco de dados')
      }
      return response.json()
    })
    .then(updateTask => {
      console.log('Tarefa atualizada com sucesso:', updateTask)
    })
    .catch(error =>{
      console.error('Erro:', error.message)
    })
}

// Function to delete a task on database
function deleteTask(taskCod) {
  fetch(`${url}/${taskCod}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao excluir a tarefa no banco de dados')
      }
      return response.json()
    })
    .then(deleteTask => {
      console.log('Tarefa excluída com sucesso:', deleteTask)
    })
    .catch(error => {
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
  editButton.addEventListener('click', () => handleEditTask(taskItem, taskTextElement, checkboxRef, taskData.cod))
  deleteButton.addEventListener('click', () => handleDeleteTask(taskItem, checkboxRef, taskData.cod))
  checkbox.addEventListener('change', () => handleCheckboxChange(checkbox, taskItem))

  taskList.appendChild(taskItem)

  updateCounter(taskCountTxt, 1)
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

function handleEditTask(taskItem, taskTextElement, checkboxRef, taskCod) {
  const taskText = taskTextElement.textContent
  const editInput = createInput('text', taskText)
  const saveButton = createButton('save-button', 'Save Edit', 'save_icon.png')
  const cancelButton = createButton('cancel-button', 'Cancel Edit', 'cancel_icon.png')

  taskTextElement.replaceWith(editInput)
  taskItem.appendChild(saveButton)
  taskItem.appendChild(cancelButton)

  saveButton.addEventListener('click', () => handleSaveText(editInput, taskTextElement, taskItem, saveButton, cancelButton, taskCod))
  cancelButton.addEventListener('click', () => handleCancelEdit(editInput, taskTextElement, taskItem, saveButton, cancelButton)) 
}

function createInput(type, value) {
  const input = document.createElement('input')
  input.type = type
  input.value = value
  input.className = 'input-edit-text'
  return input
}

function handleSaveText(editInput, taskTextElement, taskItem, saveButton, cancelButton, taskCod) {
  const editedText = editInput.value
  taskTextElement.textContent = editedText
  saveButton.remove()
  cancelButton.remove()
  editInput.replaceWith(taskTextElement)

  updateTask(taskCod, {text: editedText, strikethrough: false})
}

function handleCancelEdit(editInput, taskTextElement, taskItem, saveButton, cancelButton) {
  const cancelEditRes = confirm('Deseja descartar a edição da tarefa?')
  if (cancelEditRes) {
    editInput.replaceWith(taskTextElement)
    saveButton.remove()
    cancelButton.remove()
  }
}

function handleDeleteTask(taskItem, checkboxRef, taskCod) {
  const deleteTaskRes = confirm('Deseja deletar a tarefa?')
  if (deleteTaskRes) {
    taskList.removeChild(taskItem)
    updateCounter(taskCountTxt, -1)
    deleteTask(taskCod)
  }
  if (checkboxRef.checked) {
    subtractCompletedTaskCount()
  }
}

function handleCheckboxChange(checkbox, taskItem) {
  if (checkbox.checked) {
    taskItem.style.textDecoration = 'line-through'
    taskItem.style.color = '#40B87B'
    addCompletedTaskCount()
  } else {
    taskItem.style.textDecoration = 'none'
    taskItem.style.color = '#E6E7E8'
    subtractCompletedTaskCount()
  }
}