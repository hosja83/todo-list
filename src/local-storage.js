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

import Task from './task';
import parse from 'date-fns/parse';
import {projectFactory} from './project.js';
import ProjectList from './project-list';

export function convertTaskToStringObject(task) {
  const taskAsString = {
    name: task.getName(),
    dueDate: task.getDueDate(), //type of value in dueDate depends on how input is received
    priority: task.getPriority(),
    description: task.getDescription()
  };
  return taskAsString;
}

export function convertStringObjectToTask(taskStringObject) {
  const taskStringObjectAsTask = new Task(taskStringObject.name,
    //type of date input received from user is going to determine if we need to parse or
    //how we need to parse 
                                        parse(taskStringObject.duedate), 
                                        taskStringObject.priority,
                                        taskStringObject.description);
  return taskStringObjectAsTask;
}

export function convertProjectToStringObject(project) {
  const tasksAsStringObjects = project.getTasks().map(t => convertTaskToStringObjectNotation(t));

  const projectAsString = {
    name: project.getName(),
    tasksAsStringObjects
  };
  return projectAsString;
}

export function convertStringObjectToProject(projectStringObject) {
  const projectStringObjectAsProject = projectFactory(projectStringObject.name);

  projectStringObject.tasksAsStringObjects.forEach(t => {
    projectStringObjectAsProject.addTask(convertStringObjectToTask(t));
  });

  return projectStringObjectAsProjectl
}

export function convertProjectListToStringObject(projectList) {
  const projectListAsStringObjects = projectList.map(p => convertProjectToStringObjectNotation(p));
  
  const projectListAsString = {
    projectListAsStringObjects
  };
  return projectListAsString;
}

export function convertStringObjectToProjectList(projectListStringObject) {
  const projectListStringObjectAsProjectList = new ProjectList();

  projectListStringObject.projectListAsStringObjects.forEach(p => {
    projectListStringObjectAsProjectList.addProject(convertStringObjectToProject(p));
  });

  return projectListStringObjectAsProjectList;
}