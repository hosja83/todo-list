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
console.log(houseCleaning2.getTasks()[0].getTaskInfo());*/