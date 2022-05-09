import { formatDistanceStrict } from 'date-fns';
import _ from 'lodash';
import './style.css';

// const Task = (name, dueDate, priority, desciption) => {
  
//   this.name = name;
//   this.dueDate = dueDate;
//   this.priority = priority;
//   this.desciption = desciption;

//   const getTaskInfo = () => {
//     return `Task: ${this.name} has a ${this.priority} due on ${this.dueDate} described as: ${this.desciption}`
//   }

//   return {
//     getName: () => {return this.name},
//     getDueDate: () => {return this.dueDate},
//     getPriority: () => {return this.priority},
//     getDescription: () => {return this.desciption},
//     getTaskInfo,

//     setName: (name) => {this.name = name},
//     setDuedate: (dueDate) => {this.dueDate},
//     setPriority: (priority) => {this.priority = priority},
//     setDescription: () => {this.desciption = desciption},
//   };
// }

// const takeOutTrash = new Task('Trash Duty', 'May, 6, 2022', 'normal', 'Take out the kitchen trash');

// console.log(takeOutTrash.getTaskInfo());

// console.log(takeOutTrash.name);
// console.log(takeOutTrash.getName());

// takeOutTrash.name = 'I dont want to take out the trash';
// console.log(takeOutTrash.name);
// console.log(takeOutTrash.getName());

// takeOutTrash.setName('Trash Chore');
// console.log(takeOutTrash.getName());

const taskFactory = (name, dueDate, priority, description) => {
  //seal object from adding any properties except thru setters
  //freeze object from modifying any of its properties
  return Object.freeze(Object.seal({
    getName: () => {return name},
    getDueDate: () => {return dueDate},
    getPriority: () => {return priority},
    getDescription: () => {return description},
    getTaskInfo: () => {return `Task: ${name} has a ${priority} priority due on ${dueDate} described as: ${description}`},
    setName: (newName) => {name = newName},
    setDuedate: (newDueDate) => {dueDate = newDueDate},
    setPriority: (newPriority) => {priority = newPriority},
    setDescription: (newDescription) => {description = newDescription},
  }));

};

// Testing taskFactory module
const trash = taskFactory("Trash Duty", "May 6, 2022", "normal", "Take out the kitchen trash.");

console.log(trash.getTaskInfo());

console.log(trash);
console.log(trash.getTaskInfo());

console.log(trash.name);// cannot access undefined because we did not expose/return in object
console.log(trash.priority);
console.log(trash.dueDate);
console.log(trash.description);

console.log(trash.getName());
console.log(trash.getPriority());
console.log(trash.getDueDate());
console.log(trash.getDescription());

trash.setName('Trash Chore');
console.log(trash.getName());

trash.setDuedate('May 5 2020');
console.log(trash.getDueDate());

trash.setDescription('this is the description modified');
console.log(trash.getDescription());

trash.setPriority('low');
console.log(trash.getPriority());


// User clicks add task button (requires click event listener)

// window is displayed with input formatted form entries

// user enters required values

// user clicks complete

// task is created

// task is displayed in page under project heading