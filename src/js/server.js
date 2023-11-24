const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const connection = require('./database') // Import the database connection
const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())

// Route to get all tasks
app.get('/tasks', (req, res) => {
    const taskText = req.body.text
    connection.query('SELECT * FROM tasks', [taskText], (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Erro ao obter tarefas do banco de dados'})
        } else {
            res.json(results)
        }
    })
})

//Route to add a new task
app.post('/tasks', (req, res) => {
    const taskText = req.body.text
    connection.query('INSERT INTO tasks (Text) VALUES (?)', [taskText], (error, result) => {
        if (error) {
            console.error('Erro ao adicionar nova tarefa ao banco de dados:', error)
            res.status(500).json({ message: 'Erro ao adicionar nova tarefa ao banco de dados'})
        } else {
            res.status(201).json({ message: 'Tarefa adicionada com sucesso'})
        }
    })
})

// Route to Update Task
app.put('/tasks/:cod', (req, res) => {
    const taskCod = req.params.taskCod
    const updateText = req.body.text

    if (!updateText) {
        return res.status(400).json({ error: 'O texto da tarefa é obrigatório para a atualização.' })
    }

    // Logic to update task with taskCod in database using connection
    const updateQuery = 'UPDATE tasks SET text = ? WHERE cod = ?'

    connection.query(updateQuery, [updateText, taskCod], (error, results) => {
        if(error) {
            console.error(error)
            return res.status(500).json({ message: 'Erro ao atualizar a tarefa.' })
        }
        res.json({ message: 'Tarefa atualizada com sucesso!' })
    })
})

// Route to Delete Task
app.delete('/tasks/:cod', (req, res) => {
    const taskId = req.params.taskId

    // Logic to delete task with taskId in database using connection
    const deleteQuery = 'DELETE FROM tasks WHERE cod = ?'

    connection.query(deleteQuery, [taskId], (error, results) => {
        if (error) {
            console.error(error)
            return res.status(500).json({ message: 'Erro ao excluir a tarefa.' })
        }

        res.json({ message: 'Tarefa excluída com sucesso!' })
    })
})

app.listen(port, () => {
    console.log(`Servidor em execução na porta ${port}`)
})