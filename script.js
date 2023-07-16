var inputText = document.querySelector('.input-text');
var create = document.querySelector('.create');
var taskList = document.querySelector('.task-list');
var taskCountTxt = document.querySelector('.task-count-txt');

//Evento de criação de uma tarefa
create.addEventListener('click', task);

function addCounter(counterTaskTxt) {
    let taskCountNumber = parseInt(counterTaskTxt.textContent);
    taskCountNumber++
    counterTaskTxt.textContent = taskCountNumber++;
}

function subtractCounter(counterTaskTxt) {
    let taskCountNumber = parseInt(counterTaskTxt.textContent);
    taskCountNumber--
    counterTaskTxt.textContent = taskCountNumber--;
}

//Função para a criação de uma tarefa
function task(){
    const taskText = inputText.value.trim();    

    if(taskText !== '') {

        addCounter(taskCountTxt);

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

        //Evento para deletar uma tarefa
        deleteButton.addEventListener('click', deleteTask);

        //Função para deletar uma tarefa 
        function deleteTask(){
            taskList.removeChild(taskItem);
            subtractCounter(taskCountTxt);
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

        //Limpa o Input da tarefa
        inputText.value = ''
    } else {
        window.alert('Verifique se foi digitado algo em "Adicione uma nova tarefa"')
    }
}