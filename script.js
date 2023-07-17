let inputText = document.querySelector('.input-text');
let create = document.querySelector('.create');
let taskList = document.querySelector('.task-list');
let taskCountTxt = document.querySelector('.task-count-txt');
let completedTaskCountTxt = document.querySelector('.completed-task-count-txt');
let completedTaskCount = 0;

//Task creation event
create.addEventListener('click', task);

//Function that makes the sum of the tasks counter
function addCounter(counterTaskTxt) {
    let taskCountNumber = parseInt(counterTaskTxt.textContent);
    taskCountNumber++
    counterTaskTxt.textContent = taskCountNumber;
    updateCounter();
}

//Function that subtracts the task counter
function subtractCounter(counterTaskTxt) {
    let taskCountNumber = parseInt(counterTaskTxt.textContent);
    taskCountNumber--
    counterTaskTxt.textContent = taskCountNumber;
    updateCounter();
}

//Function that makes the sum of completed tasks
function addCompletedTaskCount(){
    completedTaskCount++;
    updateCounter();
}

//Function that subtracts completed tasks
function subtractCompletedTaskCount(){
    completedTaskCount--;
    updateCounter();
}

//Function that updates the counter of completed tasks
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

//Function for creating a task
function task(){
    const taskText = inputText.value.trim();    

    if(taskText !== '') {

        addCounter(taskCountTxt);

        //Creating the task list
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        
        //Checkbox creation
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';

        //Creating task text
        const taskTextElement = document.createElement('span');
        taskTextElement.textContent = taskText;

        //Creating the task delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';

        //Creating the delete task button image
        const trashIcon = document.createElement('img');
        trashIcon.src = '/contents/trash_icon.png';
        trashIcon.alt = 'Delete';

        //Adds the created elements as children of the task element
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskTextElement);
        taskItem.appendChild(deleteButton);
        deleteButton.appendChild(trashIcon);
        taskList.appendChild(taskItem);

        //Stores the reference to the corresponding checkbox
        const checkboxRef = checkbox;

        //Creating the event to delete a task
        deleteButton.addEventListener('click', deleteTask);

        //Function to delete a task
        function deleteTask(){
            taskList.removeChild(taskItem);
            subtractCounter(taskCountTxt);

            //Checks that the task is complete before being deleted
            if(checkboxRef.checked) {
                subtractCompletedTaskCount();
            }
        }
        
        //Checkbox event to strikethrough text
        checkbox.addEventListener('change', strikethroughText)

        //Checkbox function to strikethrough text
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

        //Clear Task Creation Input
        inputText.value = ''
    } else {
        window.alert('Verifique se foi digitado algo em "Adicione uma nova tarefa"')
    }
}