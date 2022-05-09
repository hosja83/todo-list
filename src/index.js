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

function Project(name) {
  this.name = name;
  this.tasks = [];

  return {
    getName: () => {return this.name},
    getTasks: () => {return this.tasks},
    setName: (name) => {this.name = name},
    addTask: (task) => {
      //check for duplicates
      this.tasks.forEach(t => {
        if (task.getName() === t.getName())
          return 'duplicate';
      });
      this.tasks.push(task);
      return true;
    },
    removeTask: (taskName) => {
      this.tasks.forEach(t => {
        if (taskName === t.getName()) {
          _.pullAt(tasks, [_.indexOf(tasks, t)])
          return true;
        }
      });
      return 'no match';
    },
  }
}

const projectFactory = (n) => {
  let tasks = [];
  return Object.freeze(Object.seal({
    getName: () => {return n},
    getTasks: () => {return tasks},
    setName: (newName) => {n = newName},
    addTask: (newTask) => {
      tasks.forEach(t => {
        if (t.getName() === newTask.getName())
          return 'duplicate';
      });
      this.tasks.push(newTask);
      return true;
    },
    removeTask: (taskName) => {
      this.tasks.forEach(t => {
        if (taskName === t.getName()) {
          _.pullAt(tasks, [_.indexOf(tasks, t)])
          return true;
        }
      });
      return 'no match';
    },
  }));
};


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
console.log(trash.getPriority());

// User clicks add task button (requires click event listener)
// window is displayed with input formatted form entries
// user enters required values
// user clicks complete
// task is created
// task is displayed in page under project heading