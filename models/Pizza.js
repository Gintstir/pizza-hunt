const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      default: "Large",
    },
    toppings: [], //this indicates an array as the datatype. You can also specify "Array" in place of the brackets
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false, //false because this is a virtual that mongoose returns and we dont need it. 
  }
);

//get total count of comments and replies on retrieval
PizzaSchema.virtual("commentCount").get(function () {
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
  //using the .reduce() method to tally up the total of every comment with its replies.
  //In its basic form, .reduce() takes two parameters, an accumulator and a currentValue. 
  //Here the accumulator is total and the currentValue is comment.  As .reduce() walks through
  //the array, it passes the accumulating total and the current value of comment
  //into the function with the return of the function revising the total for the 
  //next iteration through the array.
});

//create the Pizza model using the PizaSchema
const Pizza = model("Pizza", PizzaSchema);

//export the Pizza Model
module.exports = Pizza;
