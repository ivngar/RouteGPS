const express = require('express')
const app = express()
const database = require('./database.js')
const bodyParser = require('body-parser')
const path = require('path')

const port = 8080

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'index.html'))
})

app.post('/update/:file', (req, res) => {
    responseString = 'updated file: ' + req.params.file
    database.updateTable(req.params.file, function(err, result){
        console.log(result)
        res.send(responseString)
    })
})

app.get('/route', (req, res) => {
    database.getRoute(req.query.terminal, req.query.date, function(err,result) {
        if (err) {
            throw err
        } else {
            console.log(result)
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
            res.send(result)
        }
    })
})

app.get('/all', (req, res) => {
    database.checkAll(function(err,result) {
        res.send(result)
    })
})

app.use(express.static(path.join(__dirname, '../css', '')))
app.use(express.static(path.join(__dirname, '../public', '')))

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    database.createTable()

    console.log('server is listening on', port)
})
