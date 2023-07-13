var inputText = document.querySelector('.input-text');
var create = document.querySelector('.create');
var taskList = document.querySelector('.task-list');

create.addEventListener('click', task);

function task(){
    const taskText = inputText.value.trim();

    if(taskText !== '') {
        const taskItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        const taskTextElement = document.createElement('span');
        taskTextElement.textContent = taskText;
        const deleteButton = document.createElement('button');
        const trashIcon = document.createElement('img');
        trashIcon.src = '/contents/trash_icon.png';
        trashIcon.alt = 'Delete';
        deleteButton.appendChild(trashIcon);
        deleteButton.className = 'delete-button';
        taskItem.className = 'task-item';
        checkbox.className = 'checkbox';

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskTextElement);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);

        deleteButton.addEventListener('click', deleteTask);
        function deleteTask(){
            taskList.removeChild(taskItem);
        }
        
        //Evento Checkbox para tachar o texto
        checkbox.addEventListener('change', strikethroughText)

        //Função Checkbox para tachar o texto
        function strikethroughText(){
            if(this.checked) {
                taskItem.style.textDecoration = 'line-through';
                taskItem.style.color = '#40B87B';
            } else {
                taskItem.style.textDecoration = 'none';
                taskItem.style.color = '#E6E7E8';
            }
        }
    } else {
        window.alert('Verifique se foi digitado algo em "Adicione uma nova tarefa"')
    }   
}