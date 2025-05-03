require('dotenv').config();

const express = require('express');
const cors = require('cors');
const {v4: uuidv4} = require('uuid');
const bodyParser = require('body-parser');
const {static} = require("express");

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors({optionsSuccessStatus:200}));
app.use(express.static('/public'));

const users = [];
const exercises = [];
const log = [];

app.get('/', (req, res)=>{
    res.sendFile(__dirname+'/views/index.html');
})


app.post('/api/users', (req, res)=>{
    const { username } = req.body;

    if(!username) {
        return res.status(400).json({Error: 'Username is required.'});
    }

    if(users.hasOwnProperty(username)){
        return res.status(409).json({Error:'User already exists.'});
    }
    const userID = uuidv4();
    let newUser = {username:username,_id:userID};
    users.push(newUser);
    return res.status(200).json({username: newUser.username.toString(),_id:newUser._id.toString()})
});

app.get('/api/users', (req,res)=>{
    const userArray = users.map(user => ({
        username: user.username,
        _id: user._id
    }));
    return res.status(200).json(userArray);
});

app.post('/api/users/:_id/exercises', (req, res) => {
    const userId = req.params._id;
    const { description, duration, date } = req.body;

    if(!description || !duration){
        return res.status(400).json({Error: 'Description and duration are required'});
    }

    const durationNumber = parseInt(duration);
    if(isNaN(durationNumber)||durationNumber<=0){
        return res.status(400).json({Error:'Duration must be a positive.'});
    }

    const user = users.find(user=>user._id===userId);
    if(!user){
        return res.status(404).json({Error:'User not found'});
    }

    let exerciseDate = date ? new Date(date) : new Date();
    const formattedDate = exerciseDate.toDateString();
    let exercise = {
        description: description,
        duration: durationNumber,
        date: formattedDate
    };
    if (log[userId]) {
        log[userId].push(exercise);
    } else {
        log[userId] = [exercise];
    }
    exercises.push(exercise);
    let exerciseResponse = {
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date,
        _id: user._id
    };
    return res.status(200).json(exerciseResponse);

});

app.get('/api/users/:_id/logs', (req,res)=>{
    const userId = req.params._id;
    const user = users.find(user => user._id===userId);
    const { from, to, limit } = req.query;

    if(!user){
        return res.status(404).json({Error:'User not found'});
    }

    if(log.hasOwnProperty(userId)){
        let exerciseArray = log[userId] || [];
        let filteredExercise = [...exerciseArray];

        if(from){
            const fromDate = new Date(from);
            filteredExercise = filteredExercise.filter(exercise => new Date(exercise.date) >= fromDate);
        }
        if(to){
            const toDate = new Date(to);
            filteredExercise = filteredExercise.filter(exercise => new Date(exercise.date) <= toDate);
        }
        if(limit){
            const limitNumber = parseInt(limit);
            if(!isNaN(limitNumber) && limitNumber>=0)
                filteredExercise = filteredExercise.slice(0,limitNumber);
        }
        let logResponse = {
            username: user.username,
            count: filteredExercise.length,
            _id: user._id,
            log: filteredExercise
        }
        return res.status(200).json(logResponse);
    }
});

const listener = app.listen(process.env.PORT || 3000, ()=>{
    console.log("Your app is listening on port "+listener.address().port);
});


