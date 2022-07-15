//task.js

/**
 * Returns a Task object created with the given task, duedate, priority, and description. 
 * Object consists of methods to get and set it's fields.
 * 
 * @param {String} name name of the task
 * @param {Date} dueDate due date for this task
 * @param {String} priority low, normal, or high priority
 * @param {String} description description of the task
 * @returns Task object with methods to access and set it's fields
 */
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

/**
 * Returns a Task object created with the given task, duedate, priority, and description. 
 * Object consists of methods to get and set it's fields.
 * 
 * @param {String} name name of the task
 * @param {Date} dueDate due date for this task
 * @param {String} priority low, normal, or high priority
 * @param {String} description description of the task
 * @returns Task object with methods to access and set it's fields
 */
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

export {Task as default, taskFactory as taskfactory};