import './styles/style.sass';
import Project, {projectFactory as projectfactory} from './model/project';
import Task, {taskfactory} from './model/task';
import * as DOMUtil from './util/dom-util';
import ProjectList from './model/project-list';
import * as LocalStorage from './controller/local-storage';
import UserException from './view/exception';
import displayFooter from './view/footer';
import * as UIEventList from './view/event-listeners';
//npm install --save-dev @fortawesome/fontawesome-free
//npm install --save-dev @fortawesome/fontawesome-svg-core @fortawesome/free-brands-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-solid-svg-icons
import '@fortawesome/fontawesome-free/js/all'
import * as UI from './view/ui';
// import '@fortawesome/fontawesome-free/js/fontawesome';
// import '@fortawesome/fontawesome-free/js/solid';
// import '@fortawesome/fontawesome-free/js/regular';
// import '@fortawesome/fontawesome-free/js/brands';

export let todoListProjects, taskEditContainer;
export let projectNameWhereMoreOptionsDropdownDisplayed = undefined;
export let isProjectMoreOptionsDropdownDisplayed = false;
let taskInfoContainer;

//Load projectlist from localStorage, if null initialize empty project list
try {
  todoListProjects = LocalStorage.convertStringObjectToProjectList(JSON.parse(localStorage.getItem('projectList')));
} catch (e) {
  console.error(e.message, e.name);
}
//Check whether localStorage does not contain a saved todo project list or empty list
if (!todoListProjects || todoListProjects.getProjects().length === 0) {
  initProjectList();
  UIEventList.addViewProjectTasksEventListener(document.querySelector('.general'), UI.viewProjectTasks);
} else {
  //Take every project that we got from local storage and populate them onto the UI
  todoListProjects.getProjects().forEach((p, index) => {
    UI.appendProjectToList(p.getName());
    /*....Should we display the first project upon reload/refresh???
      ....Or maybe we should display Inbox or Today's tasks upon reload???
      ....For now we will display empty Task Section passing responsibility to 
      ....User to display whatever task he wants upon reload/refresh of the webpage
    */
    document.getElementById('task-list-header').textContent = "";
    if (index === 0) {null}
  });
}

UI.initUIAddListeners();
displayFooter();

/**
 * Initialize project list and returns a ProjectList object that contains the default General project.
 * @returns ProjectList object that contains the default General project
 */
 function initProjectList() { //local storage interactive result potential
  const projects = new ProjectList();
  
  const general = projectfactory("General");
  projects.addProject(general);

  document.querySelector(".general-list-item").style.display = "list-item";

  //Add unique identifier value, project name, to locate project easier for DOM manipulation
  document.querySelector('.general').setAttribute('id', general.getName());

  //Init the X cancel span element with a click event listener that deletes general project
  //... ... ...We need to add more options event handling here
  const projectMoreOptions = document.querySelector('.project-more-options');
  projectMoreOptions.setAttribute('onclick', 'displayProjectMoreOptions()');
  projectMoreOptions.onclick = displayProjectMoreOptions;

  todoListProjects = projects;
  localStorage.setItem('projectList', JSON.stringify(LocalStorage.convertProjectListToStringObject(todoListProjects)));
}

/**
 * Adds a new Task to the list of Tasks under the appropriate Project. Returns
 * 'Invalid Task' if new Task was invalid.
 * 
 * @param {Event} e event which called this method
 * @returns Invalid task if task was not a valid task or true if valid task was added
 */
export function addNewTask(e) { //localStorage interactive result potential
  //Prevent default submit event behavior
  e.preventDefault();

  // Validate Task
  let newTask;
  try {
    newTask = validateNewTask();
  } catch (e) {
    console.log(e.message, e.name);
    // Alert user if type of error is a duplicate Task title
    if (e.message === 'Duplicate Task title')
      alert('Task already exists.');
    return 'Invalid Task';
  }
  // If Task is valid, let's clear the form display
  UI.removeCreatingNewTaskForm();

  // Add newTask in the Project's list of Tasks which is under the todoListProjects
  let taskToBeAdded = taskfactory(newTask.title.trim(), newTask.date, newTask.priority, newTask.description);
  let projectToUpdate = todoListProjects.getProject(newTask.projectname);
  projectToUpdate.addTask(taskToBeAdded);

  todoListProjects.setProject(newTask.projectname, projectToUpdate);
  localStorage.setItem('projectList', JSON.stringify(LocalStorage.convertProjectListToStringObject(todoListProjects)));

  // Update task Count in left menu project list
  const projectButtonElement = document.getElementById(newTask.projectname);
  const projectTaskCountElement = projectButtonElement.querySelector('.project-task-count-icon');
  projectTaskCountElement.textContent++;

  //Populate and display the newTask in the list of tasks under the Project header
  UI.displayTask(newTask.title, newTask.date, newTask.priority);
}

function validateNewTask() {
  //Store values in variables and check their validity
  const taskName = document.getElementById('name').value;
  const taskDueDate = document.getElementById('date').value;
  const taskDescription = document.getElementById('description').value;
  const taskPriority = [...document.getElementsByName('priority')].filter(element => {
    return (element.checked === true) ? true : false;
  });

  const projectName = document.getElementById('task-list-header').textContent;
  
  const duplicateTasks = todoListProjects.getProject(projectName).getTasks().filter(t => {
    return (t.getName().trim() === taskName.trim()) ? true : false;
  });

  //Check for empty task name & duplicate task names
  if (taskName === "" || taskName === undefined || taskName === null)
    throw new UserException('Invalid Task title');
  if (duplicateTasks.length > 0)
    throw new UserException('Duplicate Task title');
  
  //Check for empty Due Date
  if (taskDueDate === "")
    throw new UserException('Invalid Due Date');

  //Check for unselected priority
  if (taskPriority.length < 1)
    throw new UserException('No priority is selected');

  //Return newly created Task object with necessary information to instantiate a Task object
  const newTask = {
    title: taskName,
    date: taskDueDate,
    priority: taskPriority[0].value,
    description: taskDescription,
    projectname: projectName,
  };

  return newTask;
}

function updateTask() { //localStorage interactive result potential
  // Validate Task
  let newTask;
  try {
    newTask = validateEditedTask(taskInfoContainer);
  } catch (e) {
    console.log(e.message, e.name);
    // Alert user if type of error is a duplicate Task title
    if (e.message === 'Duplicate Task title')
      alert('Task already exists.');
    return 'Invalid Task';
  }
  const newTaskConvertedToTaskObject = new Task(newTask.title.trim(), newTask.date, 
                                                newTask.priority, newTask.description);
  //Update Todolist & localStorage
  todoListProjects.getProject(newTask.projectname).setTask(newTask.oldTitle, newTaskConvertedToTaskObject);
  localStorage.setItem('projectList', JSON.stringify(LocalStorage.convertProjectListToStringObject(todoListProjects)));

  //From taskContainer edit displayed values such as title, date, priority flag color
  taskInfoContainer.childNodes[1].textContent = newTask.title.trim();
  taskInfoContainer.childNodes[2].textContent = newTask.date.slice(5, 7) + '/' + 
                                            newTask.date.slice(8, 10) + '/' +
                                            newTask.date.slice(0, 4);
  switch(newTask.priority) {
    case "High":
      taskInfoContainer.childNodes[3].style.fill = '#ffef00';
      break;
    case "Normal":
      taskInfoContainer.childNodes[3].style.fill = 'rgb(49, 194, 146)';
      break;
    case "Low":
      taskInfoContainer.childNodes[3].style.fill = '#c9ced2';
      break;
  }

  //Remove the Edit Task Form from display
  UI.removeEditingExistingTaskForm();
}

function validateEditedTask(taskContainer) {
  //Store values in variables and check their validity
  const taskName = document.getElementById('name-edit').value;
  const taskDueDate = document.getElementById('date-edit').value;
  const taskDescription = document.getElementById('description-edit').value;
  const taskPriority = [...document.getElementsByName('priority-edit')].filter(element => {
    return (element.checked === true) ? true : false;
  });

  //Compare with other Tasks only exclude original Task being edited by using its index
  const projectName = document.getElementById('task-list-header').textContent;
  const taskOldName = taskContainer.childNodes[1].textContent;
  const taskIndex = todoListProjects.getProject(projectName).getTaskIndex(taskOldName);
  const duplicateTasks = todoListProjects.getProject(projectName).getTasks().filter((t, index) => {
    if (index === taskIndex) return false;
    return (t.getName().trim() === taskName.trim()) ? true : false;
  });

  //Check for empty task name & duplicate task names
  if (taskName === "" || taskName === undefined || taskName === null)
    throw new UserException('Invalid Task title');
  if (duplicateTasks.length > 0)
    throw new UserException('Duplicate Task title');
  
  //Check for empty Due Date
  if (taskDueDate === "")
    throw new UserException('Invalid Due Date');

  //Check for unselected priority
  if (taskPriority.length < 1)
    throw new UserException('No priority is selected');

  //Return newly created Task object with necessary information to instantiate a Task object
  const newTask = {
    title: taskName,
    date: taskDueDate,
    priority: taskPriority[0].value,
    description: taskDescription,
    projectname: projectName,
    oldTitle: taskOldName,
  };

  return newTask;
}

/**
 * Handles the event listener that is called when user clicks on trash icon to delete task.
 * Deletes the appropriate task calling this event.
 */
export function deleteTask(event) { //localStorage interactive result potential
  //Get the project name from the task-list-header & task title from event path
  const projectName = document.getElementById('task-list-header').textContent;
  let taskContainer = event.target;
  do {
    taskContainer = taskContainer.parentNode;
  } while (!taskContainer.classList.contains("task-container"));
  const taskTitle = taskContainer.childNodes[1].textContent;

  //use the removeTask method to delete task from appropriate project & update local storage
  todoListProjects.getProjects()[todoListProjects.getProjectIndex(projectName)].removeTask(taskTitle);
  localStorage.setItem('projectList', JSON.stringify(LocalStorage.convertProjectListToStringObject(todoListProjects)));

  //Remove Task from the task list display/UI
  taskContainer.parentNode.parentNode.removeChild(taskContainer.parentNode);

  //Update Project Task Count and decrement by 1
  const projectButton = document.getElementById(projectName);
  projectButton.lastChild.textContent--;
}

/**
 * Adds a newly created project to the project list and restores view of left menu
 * @returns 'Duplicate' if element is duplicate, false if blank project, or true if project
 *          added successfully
 */
export function addProject() { //localStorage interactive result potential
  if (document.getElementById("create-project").value.trim() === "") {
    alert("Project name cannot be blank");
    return false;
  }

  const project = new Project(document.getElementById("create-project").value.trim());

  if (todoListProjects.addProject(project) === "Duplicate") 
    return 'Duplicate'; //alert is handled in project-list object
  
  localStorage.setItem('projectList', JSON.stringify(LocalStorage.convertProjectListToStringObject(todoListProjects)));

  // Call cancel event handler function to remove input and create/cancel buttons
  UI.restoreAddProjectButtonDisplay();

  UI.appendProjectToList(project.getName());
  return true;
}

//localStorage interactive result potential
function renameProject(e, projectName, projectTaskCount, projectButton, projectMoreOptionsDropdownIcon) {
  //Take the new input value and validate that it's not empty
  const renameProjectInput = e.path[3].firstElementChild.firstElementChild.lastElementChild;
  if (renameProjectInput.value.trim() === "") {
    alert("Project name cannot be blank");
    return false;
  }
  //restore project button, icon, task count, and more options view
  UI.restoreProjectButtonDisplay(e, renameProjectInput.value, projectTaskCount, 
                                 projectButton, projectMoreOptionsDropdownIcon);

  //update project name in the todolist & localStorage
  todoListProjects.getProjects()[todoListProjects.getProjectIndex(projectName)].setName(renameProjectInput.value);

  localStorage.setItem('projectList', JSON.stringify(LocalStorage.convertProjectListToStringObject(todoListProjects)));
}

function renameProjectHandler(event, projectName, projectTaskCount, projectButton, projectMoreOptionsDropdownIcon) {
  renameProject(event, projectName, projectTaskCount, projectButton, projectMoreOptionsDropdownIcon);
}

/**
 * Deletes the project that fired off this event, removing it from the project lists and HTML DOM.
 * @param {Event} event event signaled or fired
 */
export function deleteProject(event) { //localStorage interactive result potential
  // Remove project more options dropdown display
  // Update flags used by body click event listener & add/remove listener based on display prop
  event.path[2].style.display = 'none';
  isProjectMoreOptionsDropdownDisplayed = false;
  projectNameWhereMoreOptionsDropdownDisplayed = undefined;
  UIEventList.removeDocumentClearProjectMoreOptionsDropdownEventListener(UI.clearProjectMoreOptionsDropdownDisplay);

  const projectName = event.path[3].firstElementChild.getAttribute('id');

  //If project to delete is in process of adding a task from form, clear the new task form
  if (projectName === document.getElementById('task-list-header').textContent
      && document.querySelector('.task-form').style.display === 'block') {
    UI.removeCreatingNewTaskForm();
  }

  // If this project is currently displayed, remove it from view
  if (projectName === document.getElementById('task-list-header').textContent) {
    document.getElementById('task-list-header').textContent = "";
    DOMUtil.removeAllChildNodes(document.getElementById('task-list'));
  }

  // Remove from DOM and it's viewProjectTasks event listener
  // ..This may not be needed, plus event listener added on event.path[3].firstElementChild not
  // ..event.path[4] which is list item
  UIEventList.removeViewProjectTasksEventListener(event.path[3].firstElementChild, UI.viewProjectTasks);

  todoListProjects.removeProject(projectName);
  event.path[4].remove();

  localStorage.setItem('projectList', JSON.stringify(LocalStorage.convertProjectListToStringObject(todoListProjects)));
}

//..FIX THESE GLOBAL DEPENDENCIES LOGIC BY REMOVING GLOBAL VARIABLES LOGIC..
export function initEditTaskEvent(event) {
  //Retrieve event Task date, priority, & description by using task title as search criteria
  const projectName = document.getElementById('task-list-header').textContent;
  taskInfoContainer = event.target;
  do {
    taskInfoContainer = taskInfoContainer.parentNode;
  } while (!taskInfoContainer.classList.contains("task-container"));
  const taskTitle = taskInfoContainer.childNodes[1].textContent;
  
  let task = todoListProjects.getProjects()[todoListProjects.getProjectIndex(projectName)].getTask(taskTitle);

  //Display an update Task Form that is similar to Add Task Form with the task data
  document.querySelector(".task-form-edit").style.display = 'block';
  taskEditContainer = taskInfoContainer.childNodes[4];
  UIEventList.removeEditTaskEventListener(taskEditContainer, initEditTaskEvent);

  //Initialize input field values to task information
  document.getElementById('name-edit').value = task.getName();
  document.getElementById('date-edit').value = task.getDueDate();
  document.getElementById('description-edit').value = task.getDescription();
  switch(task.getPriority()) {
    case "High":
      document.getElementById('high-edit').checked = true;
      break;
    case "Normal":
      document.getElementById('normal-edit').checked = true;
      break;
    case "Low":
      document.getElementById('low-edit').checked = true;
      break;
  }

  // user may click exit X button
  UIEventList.addCancelEditingExistingTaskEventListener(UI.removeEditingExistingTaskForm);

  // user may click update task button
  UIEventList.addUpdateExistingTaskEventListener(updateTask);
}

/**
 * Renames the project that fired off this event
 * @param {Event} event event signaled or fired
 */
 function initRenameProjectEvent(event) {
  // Remove project more options dropdown display 
  // Update flags used by body click event listener & remove listener based on display prop
  event.path[2].style.display = 'none';
  isProjectMoreOptionsDropdownDisplayed = false;
  projectNameWhereMoreOptionsDropdownDisplayed = undefined;
  UIEventList.removeDocumentClearProjectMoreOptionsDropdownEventListener(UI.clearProjectMoreOptionsDropdownDisplay);

  //Check if Project is currently undergoing an add Task form operation. If so, then alert user
  //'Must complete or exit add Task form before renaming Project undergoing the add Task operation
  const projectName = event.path[3].firstElementChild.getAttribute('id');
  if (projectName === document.getElementById('task-list-header').textContent && 
      document.querySelector('.task-form').style.display === 'block') {
    alert(`Complete or exit "${projectName} New Task" form before renaming "${projectName}".`);
    return;
  }

  //Gather project task count respective to event location,for later use in initial value of text input
  const projectTaskCount = event.path[3].firstElementChild.lastElementChild.textContent;

  //Clear the textContent
  //Remove project button which contains project icon & moreOptionsdropdown icon DOM Elements
  const projectButton = event.path[3].removeChild(event.path[3].firstElementChild);
  const projectMoreOptionsDropdownIcon = event.path[3].removeChild(event.path[3].firstElementChild);

  //Instead of textContent, project task count icon, and 3dot dropdown place an input text field
  //Display the input text field and listener to user submission by click or enter.
  //Use a form tag structure just like add project
  const renameProjectForm = document.createElement('form');
  renameProjectForm.setAttribute('onsubmit', 'return false');
  renameProjectForm.noValidate = true;

  const renameProjectIconInputContainer = document.createElement('div');
  renameProjectIconInputContainer.classList.add('rename-icon-input-container');

  const renameInput = document.createElement('input');
  DOMUtil.setAttributes(renameInput, {
    "type": "text",
    "class": "create-project",
    "value": projectName, //Initialize value of input with project name 
  });

  const projectIcon = projectButton.children[0];

  const renameCancelContainer = document.createElement('div');
  renameCancelContainer.classList.add('rename-cancel-container');

  const renameButton = document.createElement('button');
  renameButton.textContent = "Rename";
  DOMUtil.setAttributes(renameButton, {
    "type": "submit",
    "class": "rename-button",
  });

  const renameCancelButton = document.createElement('button');
  renameCancelButton.textContent = "Cancel";
  DOMUtil.setAttributes(renameCancelButton, {
    "type": "button",
    "class": "rename-cancel-button",
  });

  DOMUtil.appendChildren(renameProjectForm,[renameProjectIconInputContainer,renameCancelContainer]);
  DOMUtil.appendChildren(renameProjectIconInputContainer, [projectIcon, renameInput]);
  DOMUtil.appendChildren(renameCancelContainer, [renameButton, renameCancelButton]);

  //Appends Rename Project Form as first child of project-buttons-container
  event.path[3].insertAdjacentElement('afterbegin', renameProjectForm);
  event.path[4].style.height = 'fit-content';

  //Check to see if project being renamed is currently displaying its Tasks, if so then clear
  //that content so as not to allow 'Add Task' operations while Project is being renamed
  if (projectName === document.getElementById('task-list-header').textContent) {
    document.getElementById('task-list-header').textContent = "";
    DOMUtil.removeAllChildNodes(document.getElementById('task-list'));
  }

  //Add Rename/submit event listeners and cancel click event listeners
  UIEventList.addCancelRenamingProjectEventListener(renameCancelButton, function() {
    UI.cancelRenamingProjectHandler(event, projectName, projectTaskCount, projectButton, projectMoreOptionsDropdownIcon);
  }, false);

  UIEventList.addRenameProjectEventListener(renameButton, function() {
    renameProjectHandler(event, projectName, projectTaskCount, projectButton, projectMoreOptionsDropdownIcon);
  }, false);
}

/**
 * Display project more options dropdown menu which contains rename & delete project operations.
 */
export function displayProjectMoreOptions(event) {
  const projectName = event.path[1].firstElementChild.getAttribute('id');
  
  // Check first if project more options is already there displayed as none or display
  // Update flags used by body click event listener & add/remove listener based on display prop
  if (event.path[1].childElementCount >= 3) {
    if (event.path[1].lastElementChild.style.display === "none") {
      //Before displaying a new dropdown check to see if one exits, clear if true
      if (isProjectMoreOptionsDropdownDisplayed)
        UI.clearDuplicateProjectMoreOptionsDropdownDisplay();
      event.path[1].lastElementChild.style.display = "block";
      isProjectMoreOptionsDropdownDisplayed = true;
      projectNameWhereMoreOptionsDropdownDisplayed = projectName;
      UIEventList.addDocumentClearProjectMoreOptionsDropdownEventListener(UI.clearProjectMoreOptionsDropdownDisplay);
    } else {
      event.path[1].lastElementChild.style.display = "none";
      isProjectMoreOptionsDropdownDisplayed = false;
      projectNameWhereMoreOptionsDropdownDisplayed = undefined;
      UIEventList.removeDocumentClearProjectMoreOptionsDropdownEventListener(UI.clearProjectMoreOptionsDropdownDisplay);
    }
    return;
  }

  const projectDropdownContainer = document.createElement('div');
  projectDropdownContainer.classList.add('project-dropdown-container');

  const projectDropdownContent = document.createElement('div');
  projectDropdownContent.classList.add('project-dropdown-content');

  const renameButton = document.createElement('button');
  renameButton.classList.add('rename-item');
  renameButton.textContent = "Rename";

  const deleteButton = document.createElement('delete');
  deleteButton.classList.add('delete-item');
  deleteButton.textContent = "Delete"

  projectDropdownContent.appendChild(renameButton);
  projectDropdownContent.appendChild(deleteButton);
  projectDropdownContainer.appendChild(projectDropdownContent);

  renameButton.setAttribute('onclick', 'initRenameProjectEvent()');
  renameButton.onclick = initRenameProjectEvent;

  deleteButton.setAttribute('onclick', 'deleteProject()');
  deleteButton.onclick = deleteProject;   

  //Append dropdown more options to DOM 
  //Update flags used by body click event listener & add/remove listener based on display prop
  //Before displaying a new dropdown check to see if one exits, clear if true
  if (isProjectMoreOptionsDropdownDisplayed)
    UI.clearDuplicateProjectMoreOptionsDropdownDisplay();
  event.path[1].appendChild(projectDropdownContainer);
  isProjectMoreOptionsDropdownDisplayed =  true;
  projectNameWhereMoreOptionsDropdownDisplayed = projectName;
  UIEventList.addDocumentClearProjectMoreOptionsDropdownEventListener(UI.clearProjectMoreOptionsDropdownDisplay);
}

/**
 * Validates a given String project name by checking if string is empty or composed of only
 * white spaces. Returns false if invalid, true if valid.
 * 
 * @param {String} projectNameToBeValidated given project name that needs to be validated
 */
//function isProjectNameValid(projectNameToBeValidated) {
//  return projectNameToBeValidated.trim() === "" ? false : true;
//}