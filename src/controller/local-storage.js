/*
  Because Task and Project objects are really objects that only have functions stored
  in their properties we must get the properties of Task and Project objects to store into
  storage as JSON by calling their getters. JSON cannot directly stringify and parse functions
  properly. You can use the arguments and body method and use Function interface to recreate
  the native function but this is making the design implementation too complicated. We have decided
  to simply traverse through all tasks and use the getters to create Objects that JSON can read.
  Another easier fix to this would be to make the Task and Project objects return their properties
  instead of returning their functions. This is remove the need for looping through every project
  and converting Task objects into readable objects to store in JSON format. This will be a good
  performance boost and scalability fix in the future if a user has many projects and tasks.

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

import Task from '../model/task';
import {projectFactory} from '../model/project.js';
import ProjectList from '../model/project-list';
import UserException from '../view/exception';

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