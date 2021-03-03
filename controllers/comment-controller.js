const { Comment, Pizza } = require("../models");
const { db } = require("../models/Pizza");

const commentController = {
  //add comment to pizza
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } }, //using $push to add the comment's _id to the specific pizza we want to update.  The $push method works just the same way that it works in JS- it adds to an array.
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this ID!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },

  //add a reply to a comment
  addReply({ params, body}, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body }},
      { new: true }
    )
    .then(dbPizzaData => {
      if(!dbPizzaData) {
        res.status(404).json({ message: 'No 🍕 found with this Id!' });
        return;
      }
      res.json(dbPizzaData);
    })
    .catch(err => res.json(err));
  },

  //delete reply
  removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $pull: { replies: {replyId: params.replyId }}}, //using $pull to remove a specific reply from the replies array where the replyId matches the value of params.replyId passed in from the route.
      { new: true }
      )
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.json(err));
  },

  //remove comment from pizza
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then((deletedComment) => {
        if (!deletedComment) {
          res.status(404).json({ message: "No comment found with that ID!" });
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this ID!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  }, 
};

module.exports = commentController;
