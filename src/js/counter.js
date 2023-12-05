import { taskCountTxt } from './index.js'

export {
  addCounter,
  subtractCounter,
  addCompletedTaskCount,
  subtractCompletedTaskCount,
  updateCounter,
}

const completedTaskCountTxt = document.querySelector(
  '.completed-task-count-txt',
)
let completedTaskCount = 0

// Function that makes the sum of the tasks counter
function addCounter(counterTaskTxt) {
  let taskCountNumber = parseInt(counterTaskTxt.textContent)
  taskCountNumber++
  counterTaskTxt.textContent = taskCountNumber
  updateCounter()
}

// Function that subtracts the task counter
function subtractCounter(counterTaskTxt) {
  let taskCountNumber = parseInt(counterTaskTxt.textContent)
  taskCountNumber--
  counterTaskTxt.textContent = taskCountNumber
  updateCounter()
}

// Function that makes the sum of completed tasks
function addCompletedTaskCount() {
  completedTaskCount++
  updateCounter()
}

// Function that subtracts completed tasks
function subtractCompletedTaskCount() {
  completedTaskCount--
  updateCounter()
}

// Function that updates the counter of completed tasks
function updateCounter() {
  const text = completedTaskCountTxt.textContent
  const numbers = text.match(/\d+/g)

  if (numbers.length === 2) {
    let number1 = parseInt(numbers[0])
    let number2 = parseInt(numbers[1])

    const taskCountNumber = parseInt(taskCountTxt.textContent)

    number1 = completedTaskCount
    number2 = taskCountNumber

    const newText = number1 + ' de ' + number2
    completedTaskCountTxt.textContent = newText
  }
}
