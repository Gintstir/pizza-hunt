//creat a variable to hold db connection;
let db;

//establish a connection to IndexedDB databse called 'pizza_hunt' and set it to version 1
const request = indexedDB.open("pizza_hunt", 1);

/*
Here, we create a variable db that will store the connected database object when the connection is complete.
After that, we create the request variable to act as an event listener for the database. 
That event listener is created when we open the connection to the database using the indexedDB.open() method.
As part of the browser's window object, indexedDB is a global variable. Thus, we could say window.indexedDB, but there's no need to.
The .open() method we use here takes the following two parameters:

-The name of the IndexedDB database you'd like to create (if it doesn't exist) or connect to (if it does exist). We'll use the name pizza_hunt.
-The version of the database. By default, we start it at 1. This parameter is used to determine whether the database's structure has changed between connections.
Think of it as if you were changing the columns of a SQL database.
 */

//this event will emit if the database version changes( nonexistant to version 1, v1 to v2, etc)
request.onupgradeneeded = function (event) {
  //save a reference to the database
  const db = event.target.result;
  //create an object store (table) called 'new_pizza', set it to have an auto incrementing primary key of sorts
  db.createObjectStore("new_pizza", { autoIncrement: true });
};

//upon successfull
request.onsuccess = function (event) {
  //when db is successfully created with its object sotre( from onupgradeneeded event above) or simp[ly established a connection
  //save reference to db inm global variable
  db = event.target.result;

  //check if app is online, if yes run uploadPizza() function to send all local db to api
  if (navigator.online) {
    uploadPizza();
  }
};

request.onerror = function (event) {
  //log error here
  console.log(event.target.errorCode);
};

//this funct4ion will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
  //open a new transaction with that database with read and write permission
  const transaction = db.transaction(["new_pizza"], "readwrite");

  //access the object store for 'new_pizza'
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  //add record to your store with add method
  pizzaObjectStore.add(record);
}

function uploadPizza() {
  //open a transaction on your db
  const transaction = db.transaction(["new_pizza"], "readwrite");

  //access your object store
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  //get all recors from store and set to a variable
  const getAll = pizzaObjectStore.getAll();

  //upon successful .getAll() execution, run this function
  getAll.onsuccess = function () {
    // if there was data in indexedDb's store, send it to the api server
    if (getAll.result.length > 0) {
      fetch("/api/pizzas", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
      .then(response => response.json())
      .then(serverResponse => {
          if(serverResponse.message) {
              throw new Error(serverResponse);
          }
          // Open one more transaction
          const transaction = db.transaction(['new_pizza'], 'readwrite');
          //access the new_pizza object store
          const pizzaObjectStore = transaction.objectStore('new_pizza');
          //clear all items in your store
          pizzaObjectStore.clear();

          alert('All saved pizzas have been submitted');
      })
      .catch(err => {
          console.log(err);
      });
    }
  };
}

//listen got app coming back online
window.addEventListener('online', uploadPizza);