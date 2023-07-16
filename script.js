let inputText = document.querySelector('.input-text');
let create = document.querySelector('.create');
let taskList = document.querySelector('.task-list');
let taskCountTxt = document.querySelector('.task-count-txt');
let completedTaskCountTxt = document.querySelector('.completed-task-count-txt');
let completedTaskCount = 0;

//Evento de criação de uma tarefa
create.addEventListener('click', task);

//Função que faz a soma do contador de tarefas
function addCounter(counterTaskTxt) {
    let taskCountNumber = parseInt(counterTaskTxt.textContent);
    taskCountNumber++
    counterTaskTxt.textContent = taskCountNumber;
    updateCounter();
}

//Função que faz a subtração do contador de tarefas
function subtractCounter(counterTaskTxt) {
    let taskCountNumber = parseInt(counterTaskTxt.textContent);
    taskCountNumber--
    counterTaskTxt.textContent = taskCountNumber;
    updateCounter();
}

//Função que faz a soma das tarefas concluidas
function addCompletedTaskCount(){
    completedTaskCount++;
    updateCounter();
}

//Função que faz a subtração das tarefas concluidas
function subtractCompletedTaskCount(){
    completedTaskCount--;
    updateCounter();
}

//Função que atualiza o contador de tarefas concluidas
function updateCounter(){
    let text = completedTaskCountTxt.textContent;
    let numbers = text.match(/\d+/g);

    if (numbers.length === 2) {
        let number1 = parseInt(numbers[0]);
        let number2 = parseInt(numbers[1]);

        let taskCountNumber = parseInt(taskCountTxt.textContent);

        number1 = completedTaskCount;
        number2 = taskCountNumber;

        let newText = number1 + ' de ' + number2;
        completedTaskCountTxt.textContent = newText;
    }
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

        // Armazena a referência ao checkbox correspondente
        const checkboxRef = checkbox;

        //Evento para deletar uma tarefa
        deleteButton.addEventListener('click', deleteTask);

        //Função para deletar uma tarefa 
        function deleteTask(){
            taskList.removeChild(taskItem);
            subtractCounter(taskCountTxt);

            // Verifica se a tarefa estava concluída antes de ser excluída
            if(checkboxRef.checked) {
                subtractCompletedTaskCount();
            }
        }
        
        //Evento Checkbox para tachar o texto
        checkbox.addEventListener('change', strikethroughText)

        //Função Checkbox para tachar o texto
        function strikethroughText(){
            if(this.checked) {
                taskItem.style.textDecoration = 'line-through';
                taskItem.style.color = '#40B87B';
                addCompletedTaskCount();
            } else {
                taskItem.style.textDecoration = 'none';
                taskItem.style.color = '#E6E7E8';
                subtractCompletedTaskCount();
            }
        }

        //Limpa o Input da tarefa
        inputText.value = ''
    } else {
        window.alert('Verifique se foi digitado algo em "Adicione uma nova tarefa"')
    }
}