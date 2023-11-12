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

// Task creation event
create.addEventListener('click', task)

// Function for creating a task
function task () {
  const taskText = inputText.value.trim()

  if (taskText !== '') {
    addCounter(taskCountTxt)

    // Creating the task list
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item'

    // Checkbox creation
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.className = 'checkbox'

    // Creating the edit task button
    const editButton = document.createElement('button')
    editButton.className = 'edit-button'

    // Creating the edit task button image
    const editIcon = document.createElement('img')
    editIcon.src = '/public/assets/pencil_icon.png'
    editIcon.alt = 'Edit'

    // Creating task text
    const taskTextElement = document.createElement('span')
    taskTextElement.textContent = taskText
    taskTextElement.className = 'task-text'

    // Creating the task delete button
    const deleteButton = document.createElement('button')
    deleteButton.className = 'delete-button'

    // Creating the delete task button image
    const trashIcon = document.createElement('img')
    trashIcon.src = '/public/assets/trash_icon.png'
    trashIcon.alt = 'Delete'

    // Adds the created elements as children of the task element
    taskItem.appendChild(checkbox)
    taskItem.appendChild(editButton)
    editButton.appendChild(editIcon)
    taskItem.appendChild(taskTextElement)
    taskItem.appendChild(deleteButton)
    deleteButton.appendChild(trashIcon)
    taskList.appendChild(taskItem)

    // Stores the reference to the corresponding checkbox
    const checkboxRef = checkbox

    // Creating the event to edit a task
    editButton.addEventListener('click', editTask)

    // Function to edit a task
    function editTask(){
      // Retrieves the text element of the task you want to edit
      const taskTextElement = taskItem.querySelector('span')
      const taskText = taskTextElement.textContent

      // Create a text input field for editing
      const editInput = document.createElement('input')
      editInput.type = 'text'
      editInput.value = taskText
      editInput.className = 'input-edit-text'

      // Replaces text element with text input
      taskTextElement.replaceWith(editInput)

      // Create a Save button
      const saveButton = document.createElement('button')
      saveButton.className = 'save-button'

      // Creating the save task button image
      const saveIcon = document.createElement('img')
      saveIcon.src = '/public/assets/save_icon.png'
      saveIcon.alt = 'Save Edit'

      // Create a cancel button
      const cancelButton = document.createElement('button')
      cancelButton.className = 'cancel-button'

      // Creating the cancel task button image
      const cancelIcon = document.createElement('img')
      cancelIcon.src = '/public/assets/cancel_icon.png'
      cancelIcon.alt = 'Cancel Edit'

      // Add Save button to task element
      taskItem.appendChild(saveButton)
      saveButton.appendChild(saveIcon)

      //Add Cancel button to task element
      taskItem.appendChild(cancelButton)
      cancelButton.appendChild(cancelIcon)

      // Add a click event to the Save button to confirm changes
      saveButton.addEventListener('click', saveText)

      // Add a click event to the Cancel button to cancel changes
      cancelButton.addEventListener('click', cancelEdit)

      function saveText(){
        const editedText = editInput.value
        // Update the task text with the edited text
        taskTextElement.textContent = editedText

        // Replace input field and remove Save button
        saveButton.remove()
        cancelButton.remove()
        editInput.replaceWith(taskTextElement)
      }

      function cancelEdit(){
        var cancelEditRes = confirm('Deseja descartar a edição da tarefa?')
        if(cancelEditRes){
          editInput.replaceWith(taskTextElement)
        saveButton.remove()
        cancelButton.remove()
        }
      }
    }

    // Creating the event to delete a task
    deleteButton.addEventListener('click', deleteTask)

    // Function to delete a task
    function deleteTask () {
      var deleteTaskRes = confirm('Deseja deletar a tarefa?')
      if(deleteTaskRes){
        taskList.removeChild(taskItem)
        subtractCounter(taskCountTxt)
      }
      // Checks that the task is complete before being deleted
      if (checkboxRef.checked) {
        subtractCompletedTaskCount()
      }
    }

    // Checkbox event to strikethrough text
    checkbox.addEventListener('change', strikethroughText)

    // Checkbox function to strikethrough text
    function strikethroughText () {
      if (this.checked) {
        taskItem.style.textDecoration = 'line-through'
        taskItem.style.color = '#40B87B'
        addCompletedTaskCount()
      } else {
        taskItem.style.textDecoration = 'none'
        taskItem.style.color = '#E6E7E8'
        subtractCompletedTaskCount()
      }
    }

    // Clear Task Creation Input
    inputText.value = ''
  } else {
    window.alert(
      'Verifique se foi digitado algo em "Adicione uma nova tarefa"'
    )
  }
}