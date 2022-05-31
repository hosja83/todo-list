/*
  //Example: Task Object Converted to a String Object for saving into Local Storage
  let taskAsString = {
    name: task.getName(),
    dueDate: task.getDueDate(),
    priority: task.getPriority(),
    description: task.getDescription()
  };
  //Example: Project Object Converted to a String Object for saving into Local Storage
  let projectAsString = {
    name: general.getName(),
    tasks: {
      taskAsString,
      task2AsString
    }
  };
  //Example: Project List Object converted to a String Object for saving into Local Storage
  let projectListAsString = {
    projectAsString
  };

  //Examples: Using JSON.stringify and parse to save into and load from local storage correctly
  localStorage.setItem('ProjectListAsString', JSON.stringify(projectListAsString));
  JSON.parse(localStorage.getItem('ProjectListAsString'));
  */

export function convertTaskToStringObjectNotation(task) {
  let taskAsString = {
    name: task.getName(),
    dueDate: task.getDueDate(), //type of value in dueDate depends on how input is received
    priority: task.getPriority(),
    description: task.getDescription()
  };
  return taskAsString;
}

export function convertProjectToStringObjectNotation(project) {
  const tasksAsStringObjects = project.getTasks().map(t => convertTaskToStringObjectNotation(t));

  let projectAsString = {
    name: project.getName(),
    tasksAsStringObjects
  };
  return projectAsString;
}

export function converProjectListToStringObjectNotation(projectList) {
  const projectListAsStringObjects = projectList.map(p => convertProjectToStringObjectNotation(p));
  
  let projectListAsString = {
    projectListAsStringObjects
  };
  return projectListAsString;
}