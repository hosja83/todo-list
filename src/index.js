import { formatDistanceStrict } from 'date-fns';
import _, { indexOf } from 'lodash';
import './style.css';

function Task(name, dueDate, priority, description) {
  
  this.name = name;
  this.dueDate = dueDate;
  this.priority = priority;
  this.description = description;

  const getTaskInfo = () => {
    return `Task: ${this.name} has a ${this.priority} due on ${this.dueDate} described as: ${this.description}`
  }

  return {
    getName: () => {return this.name},
    getDueDate: () => {return this.dueDate},
    getPriority: () => {return this.priority},
    getDescription: () => {return this.description},
    getTaskInfo,
    setName: (name) => {this.name = name},
    setDuedate: (dueDate) => {this.dueDate = dueDate},
    setPriority: (priority) => {this.priority = priority},
    setDescription: (description) => {this.description = description},
  };
}

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


function Project(name) {
  this.name = name;
  this.tasks = new Array();

  return Object.freeze(Object.seal({
    getName: () => {return this.name},
    getTasks: () => {return this.tasks},
    setName: (name) => {this.name = name},
    addTask: (task) => {
      if (! task instanceof Task )
        return 'param not instance of Task';
      this.tasks.forEach(t => {
        if (task.getName() === t.getName())
          return 'duplicate';
      });
      this.tasks.push(task);
      return true;
    },
    removeTask: (taskName) => {
      let istaskFound = false;
      let result; 
      this.tasks.forEach(t => {
        if (taskName === t.getName()) {
          istaskFound = true;
          result = _.pullAt(tasks, [_.indexOf(tasks, t)]); //returns array containing remove elements
        }
      });
      return istaskFound ? result : 'task to be removed not found';
    },
  }));
}

const projectFactory = (n) => {
  let tasks = new Array();
  return Object.freeze(Object.seal({
    getName: () => {return n},
    getTasks: () => {return tasks},
    setName: (newName) => {n = newName},
    addTask: (newTask) => {
      if (! newTask instanceof Task )
        return 'param not instance of Task';
      tasks.forEach(t => {
        if (t.getName() === newTask.getName())
          return 'duplicate';
      });
      tasks.push(newTask);
      return true;
    },
    removeTask: (taskName) => {
      let istaskFound = false;
      let result;
      tasks.forEach(t => {
        if (taskName === t.getName()) {
          istaskFound = true;
          result = _.pullAt(tasks, [_.indexOf(tasks, t)]); //returns array containing remove elements
        }
      });
      return istaskFound ? result : 'task to be removed not found';
    },
  }));
};

/*
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
console.log(houseCleaning2.getTasks()[0].getTaskInfo());




// Console Log testing for Task object constructor and task factory function pattern
const trashDuty = new Task("Trash Duty", "May 6, 2022", "normal", "Take out the kitchen trash.");

console.log(trashDuty.getTaskInfo());

console.log(trashDuty);
console.log(trashDuty.getTaskInfo());

console.log(trashDuty.name);// cannot access undefined because we did not expose/return in object
console.log(trashDuty.priority);
console.log(trashDuty.dueDate);
console.log(trashDuty.description);

console.log(trashDuty.getName());
console.log(trashDuty.getPriority());
console.log(trashDuty.getDueDate());
console.log(trashDuty.getDescription());

trashDuty.setName('Trash Chore');
console.log(trashDuty.getName());

trashDuty.setDuedate('May 5 2020');
console.log(trashDuty.getDueDate());

trashDuty.setDescription('this is the description modified');
console.log(trashDuty.getDescription());

trashDuty.setPriority('low');
console.log(trashDuty.getPriority());


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
console.log(trash.getPriority());*/

// User clicks add task button (requires click event listener)
// window is displayed with input formatted form entries
// user enters required values
// user clicks complete
// task is created
// task is displayed in page under project heading

/**
 * Creates new elements with given tag names and appends parent element to child element.
 * Returns parent element with appended child.
 * 
 * @param {string} parentElementTagName tag name of parent element
 * @param {string} childElementTagName tag name of child element
 * @return {HTMLElement} returns parent element with appended child
 */
 function appendChildToParent(parentElementTagName, childElementTagName) {
  const parent = document.createElement(parentElementTagName);
  const child = document.createElement(childElementTagName);
  parent.appendChild(child);
  return parent;
}

/**
 * Returns removed given element
 * 
 * @param {HTMLElement} element element to be removed
 * @returns {HTMLElement} removed element
 */
function removeElement(element) {
  return element.parentNode.removeChild(element);
}


activateAddProjectListener();

function activateAddProjectListener() {document.getElementById("add-project").addEventListener('click', addProject)}

function addProject() {
  // Add Project button disappears temporarily
  const addProjectElement = removeElement(document.getElementById("add-project"));
  // Input text field appears, with text input used to create project with a new name and empty tasks list
  document.getElementById("on-add-project").style.display = "block";
  // If user clicks 'X'/cancel then project does not get created nothing changes
  activateCancelProjectListener();
  // If user clicks add/create/'check' then project gets added under project menu
  activateCreateProjectListener();
}

function activateCancelProjectListener() {document.getElementById("cancel-on-add-project").addEventListener('click', cancelOnAddProject)}

function cancelOnAddProject() {
  const input = document.getElementById("create-project");
  input.value = "";

  document.getElementById("on-add-project").style.display = "none";

  const leftMenu = document.querySelector(".left-menu").appendChild(document.createElement('button'));
  leftMenu.setAttribute('id', "add-project");
  leftMenu.textContent = "Add Project";

  activateAddProjectListener();
}

function activateCreateProjectListener() {document.getElementById("create-on-add-project").addEventListener('click', createProject)}

function createProject() {
  const input = document.getElementById("create-project");
  
  if (input.value === "") {
    alert("Project name cannot be blank");
    return false;
  }

  const projectName = input.value;
  const project = new Project(projectName);

  cancelOnAddProject();

  const projectElement = appendChildToParent('li', 'button');
  projectElement.firstChild.textContent = project.getName();
  document.getElementById("project-list").append(projectElement);
}

