// project.js

import { _pullAt} from 'lodash';

/**
 * Returns a Project object created with the given name and an empty list of Task objects. 
 * Object consists of methods to get and set it's fields.
 * 
 * @param {String} name name given for the project
 * @returns Project object with given name
 */
export default function Project(name) {

  this.name = name.trim();
  this.tasks = new Array();
  this.taskCount = 0;

  return Object.freeze(Object.seal({
    getName: () => {return this.name},
    getTasks: () => {return this.tasks},
    getTaskCount: () => {return this.taskCount},
    getTask: (taskName) => {
      let task;
      this.tasks.forEach(t => {
        if (t.getName() === taskName) {
          task = t;
          return;
        }
      });
      return task;
    },
    getTaskIndex: (taskName) => {
      return this.tasks.findIndex(t => t.getName() === taskName ? true : false);
    },
    setTaskCount: (taskCount) => {this.taskCount = taskCount},
    setName: (name) => {this.name = name.trim()},
    setTask: (taskName, newTask) => {
      const index = tasks.findIndex(t => t.getName() === taskName ? true : false);
      this.tasks[index] = newTask;
    },
    addTask: (task) => {
      // This check doesn't work
      // if (! (newTask instanceof Task) )
      //   return 'param not instance of Task';
      this.tasks.forEach(t => {
        if (task.getName() === t.getName())
          return 'duplicate';
      });
      this.tasks.push(task);
      this.taskCount++;
      return true;
    },
    removeTask: (taskName) => {
      let istaskFound = false;
      let result; 
      this.tasks.forEach((t, index) => {
        if (taskName === t.getName()) {
          istaskFound = true;
          result = _.pullAt(this.tasks, [index]); //returns array containing remove elements
          return;                       //_indexOf(this.tasks, t) different method to go about it
        }
      });
      if (istaskFound) this.taskCount--;
      return istaskFound ? result : 'task to be removed not found';
    },
  }));
}

/**
 * Returns a Project object created with the given name and an empty list of Task objects. 
 * Object consists of methods to get and set it's fields.
 * 
 * @param {String} n name of the project
 * @returns project object with given name
 */
export const projectFactory = (n) => {
  let tasks = new Array();
  let taskCount = 0;
  return Object.freeze(Object.seal({
    getName: () => {return n.trim()},
    getTasks: () => {return tasks},
    getTaskCount: () => {return taskCount},
    getTask: (taskName) => {
      let task;
      tasks.forEach(t => {
        if (t.getName() === taskName) {
          task = t;
          return;
        }
      });
      return task;
    },
    getTaskIndex: (taskName) => {
      return tasks.findIndex(t => t.getName() === taskName ? true : false);
    },
    setTaskCount: (newTaskCount) => {taskCount = newTaskCount},
    setName: (newName) => {n = newName.trim()},
    setTask: (taskName, newTask) => {
      const index = tasks.findIndex(t => t.getName() === taskName ? true : false);
      tasks[index] = newTask;
    },
    addTask: (newTask) => {
      // This check doesn't work
      // if (! (newTask instanceof Task) )
      //   return 'param not instance of Task';
      tasks.forEach(t => {
        if (t.getName() === newTask.getName())
          return 'duplicate';
      });
      tasks.push(newTask);
      taskCount++;
      return true;
    },
    removeTask: (taskName) => {
      let istaskFound = false;
      let result;
      tasks.forEach((t, index) => {
        if (taskName === t.getName()) {
          istaskFound = true;
          result = _.pullAt(tasks, [index]); //returns array containing remove elements
          return;
        }
      });
      if (istaskFound) taskCount--;
      return istaskFound ? result : 'task to be removed not found';
    },
  }));
};