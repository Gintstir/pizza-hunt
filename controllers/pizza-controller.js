const { Pizza } = require('../models');
const { db } = require('../models/Pizza');

const pizzaController = {
    //the function will go in here as methods
    //get all pizzas same as findAll
    getAllPizza(req, res) {
        Pizza.find({})
        .populate({
            path: 'comments',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 }) //this sorts in desc order by the _id value
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //get one pizza by ID same as findOne
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
        .populate({
            path: 'comments',
            select: '-__v'
        })
        .select('-__v')
        .then(dbPizzaData => {
            //if no pizza data is found return 404
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //create a Pizza POST
    createPizza({ body }, res) {
        Pizza.create(body)
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.status(400).json(err))
    },

    //update a pizza by ID PUT
    updatePizza({ params, body}, res) {
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true }) //if we dont set new: true it wont update and will return the original, must set  runValidators to true so it knows to validate any new information
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err))
    },

    //Delete a Pizza
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
        .then(dbPizzaData => {
            if(!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with that id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err));
    }

};

module.exports = pizzaController;