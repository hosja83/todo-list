const project = require("../src/project");

/* Transform console.log code into jest testing cases
//Console Log testing for Project object constructor and project factory function pattern
const houseCleaning = new Project("House Cleaning");
console.log(houseCleaning.getName());
console.log(houseCleaning.getTasks());

const cleanDishes = new Task("Dish Cleaning", "May 15, 2022", "normal", "Clean the dishes.");
const addHouseCleaning = houseCleaning.addTask(cleanDishes);

console.log(addHouseCleaning);
console.log(houseCleaning.getTasks());
console.log(houseCleaning.getTasks()[0].getName());
console.log(houseCleaning.getTasks()[0].getDueDate());
console.log(houseCleaning.getTasks()[0].getPriority());
console.log(houseCleaning.getTasks()[0].getDescription());
console.log(houseCleaning.getTasks()[0].getTaskInfo());

const vacumRoom = new Task("Clean Carpet", "May 16, 2022", "high", "Vacum the living room get rid of roaches.");
const addVacumRoom = houseCleaning.addTask(vacumRoom);

console.log(addVacumRoom);
console.log(houseCleaning.getTasks());
console.log(houseCleaning.getTasks()[1].getName());
console.log(houseCleaning.getTasks()[1].getDueDate());
console.log(houseCleaning.getTasks()[1].getPriority());
console.log(houseCleaning.getTasks()[1].getDescription());
console.log(houseCleaning.getTasks()[1].getTaskInfo());


const houseCleaning2 = projectFactory("Clean Bathroom");
console.log(houseCleaning2.getName());
console.log(houseCleaning2.getTasks());

const cleanBathroom = new Task("Bathroom Cleaning", "May 10, 2022", "low", "Wipe the bathroom toilet ya moron");
const addHouseCleaning2 = houseCleaning2.addTask(cleanBathroom);

console.log(addHouseCleaning2);
console.log(houseCleaning2.getTasks());
console.log(houseCleaning2.getTasks()[0].getName());
console.log(houseCleaning2.getTasks()[0].getDueDate());
console.log(houseCleaning2.getTasks()[0].getPriority());
console.log(houseCleaning2.getTasks()[0].getDescription());
console.log(houseCleaning2.getTasks()[0].getTaskInfo());

const laundry = new Task("Laundry", "May 9, 2022", "low", "Get your laundry done ok");
const addVacumRoom2 = houseCleaning2.addTask(laundry);

console.log(addVacumRoom2);
console.log(houseCleaning2.getTasks());
console.log(houseCleaning2.getTasks()[1].getName());
console.log(houseCleaning2.getTasks()[1].getDueDate());
console.log(houseCleaning2.getTasks()[1].getPriority());
console.log(houseCleaning2.getTasks()[1].getDescription());
console.log(houseCleaning2.getTasks()[1].getTaskInfo());

console.log(houseCleaning2.removeTask("Homework"));
console.log(houseCleaning2.removeTask("Bathroom Cleaning")[0].getName());

console.log(houseCleaning2.getTasks());
console.log(houseCleaning2.getTasks()[0].getName());
console.log(houseCleaning2.getTasks()[0].getDueDate());
console.log(houseCleaning2.getTasks()[0].getPriority());
console.log(houseCleaning2.getTasks()[0].getDescription());
console.log(houseCleaning2.getTasks()[0].getTaskInfo());*/