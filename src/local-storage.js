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
    taskCount: general.getTaskCount().toString()
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

  //Examples: How projectList with General empty tasks initialized looks like in localStorage
  '{
    "projectListAsStringObjects":
      [
        {
          "name":"General",
          "taskCount": "0",
          "tasksAsStringObjects":[]
        }
      ]
  }'

  '{
    "projectListAsStringObjects":
      [
        {
          "name":"General",
          "taskCount": "0",
          "tasksAsStringObjects":[]
        },
        {
          "name":"Hello",
          "taskCount": "0",
          "tasksAsStringObjects":[]
        }
      ]
  }'

  '{
    "projectListAsStringObjects":
      [
        {
          "name":"General",
          "taskCount": "1",
          "tasksAsStringObjects":
            [
              {
                "name":"Quran",
                "dueDate":"2022-06-05",
                "priority":"High",
                "description":"Quran Study"
              }
            ]
        }
      ]
  }'

  //IMPORTANT TO NOTE: LOCAL STORAGE ONLY STORES STRINGS SO YOU MUST STRINGIFY YOUR OBJECTS
  //USING JSON.stringify AND YOU MUST PARSE YOUR OBJECTS BEING STORED AND RETRIEVED BACK
  //TO THEIR APPROPRIATE STATES. SO IF YOU ARE STORING OBJECTS YOU MUST PREPARE THEM TO BE 
  //STRINGIFIED BEFORE STORING. IF YOU ARE RETRIEVING OBJECTS FROM LOCAL STORAGE YOU MUST
  //CONVERT THEM BACK TO THEIR ORIGINAL STATES TO BE READ PROPERLY IN YOUR PROGRAM.
*/

import Task from './task';
import {projectFactory} from './project.js';
import ProjectList from './project-list';
import UserException from './exception';

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
                                        taskStringObject.dueDate, 
                                        taskStringObject.priority,
                                        taskStringObject.description);
  return taskStringObjectAsTask;
}

export function convertProjectToStringObject(project) {
  const tasksAsStringObjects = project.getTasks().map(t => convertTaskToStringObject(t));

  const projectAsString = {
    name: project.getName(),
    taskCount: project.getTaskCount().toString(),
    tasksAsStringObjects
  };
  return projectAsString;
}

export function convertStringObjectToProject(projectStringObject) {
  const projectStringObjectAsProject = projectFactory(projectStringObject.name);

  projectStringObject.tasksAsStringObjects.forEach(t => {
    projectStringObjectAsProject.addTask(convertStringObjectToTask(t));
  });

  projectStringObjectAsProject.setTaskCount(Number(projectStringObject.taskCount));

  return projectStringObjectAsProject;
}

export function convertProjectListToStringObject(projectList) {
  const projectListAsStringObjects = projectList.getProjects().map(p => convertProjectToStringObject(p));
  
  const projectListAsString = {
    projectListAsStringObjects
  };
  return projectListAsString;
}

export function convertStringObjectToProjectList(projectListStringObject) {
  if (projectListStringObject === undefined || 
      projectListStringObject === null || 
      projectListStringObject === 'null') {
    throw new UserException('ProjectListNull');
  }

  const projectListStringObjectAsProjectList = new ProjectList();

  projectListStringObject.projectListAsStringObjects.forEach(p => {
    projectListStringObjectAsProjectList.addProject(convertStringObjectToProject(p));
  });

  return projectListStringObjectAsProjectList;
}