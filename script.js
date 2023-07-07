var inputText = document.getElementById('inputText');
var create = document.getElementById('create');
var taskList = document.getElementById('taskList');

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
        trashIcon.alt = 'Excluir';
        deleteButton.appendChild(trashIcon);
        deleteButton.id = 'deleteButton';
        taskItem.className = 'taskItem';

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskTextElement);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);

        deleteButton.addEventListener('click', deleteTask);
        function deleteTask(){
            taskList.removeChild(taskItem);
        }

        /*
        Criar evento para o checkbox
        Quando for marcado mostrar que uma tarefa foi completa e
        tachar o texto
        checkbox.addEventListener()
        */
        

    } else {
        window.alert('Verifique se foi digitado algo em "Adicione uma nova tarefa"')
    }
}