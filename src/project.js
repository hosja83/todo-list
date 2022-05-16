import {_indexOf, _pullAt} from 'lodash';

export default function Project(name) {

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

export const projectFactory = (n) => {
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