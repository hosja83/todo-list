import './style.sass';
import Project, {projectFactory as projectfactory} from './project';
import {taskfactory} from './task';
import * as DOMUtil from './dom-util';
import ProjectList from './project-list';
import * as LocalStorage from './local-storage';
import UserException from './exception';

const elements = {
  //Be careful with this implementation because these document function calls might only get called
  //once so if you need updated document information than this might lead to bugs, keep note of this
  //later on if you encounter bugs
  addProjectInputContainer: document.getElementById("on-add-project"),
  addProjectInput: document.getElementById("create-project"),
  addProjectButton: document.getElementById("add-project-button"),
  leftMenuContainer: document.querySelector(".left-menu"),
  projectList: document.getElementById("project-list"),
  cancelButton: document.getElementById("cancel-on-add-project"),
  createButton: document.getElementById("create-on-add-project"),
  taskList: document.getElementById('task-list'),
}

/*
  Features To Implement in Future:
   - Inbox
   - Making Inbox the main project/category that always shows up upon page reload, refresh, etc...
   - Today
   - Tomorrow
   - This Week
   - This Month
   - View All Tasks from All projects sorted by Project
   - View All Tasks from All Projects sorted by Date
   - View All Tasks from All Projects sorted by Priority
   - Sort Tasks of specific project selected and displayed by priority
   - Sort Tasks of specific project selected and displayed by date
   - Sort Projects by Name Alphabetically A - Z
   - Sort Projects by Name Alphabetically Z - A
   - Sort Projects by Largest Number of Tasks
   - Sort Projects by Smallest Number of Tasks
   - Give User option to move menu nav bar left, top, or right
   - Mobile App Friendly
   - Different Colors for different Priorities
   - Move a Task to another Project (button attached to Task that shows dropdown list of projects)
   - Have the optional feature that user can specify exact time task needs to be done by
   - Have a ... button next to Project name that gives option to rename or delete project
   - Have a button on the existing task that moves the existing task to another project.
     Also if adding features/button icons become crowded, add the vertical three dot icon that
     represents "More" options
   - Implement a toggle button on the top right hand corner of page switch between light-colored,
     colored, to dark mode
   - Implement a search bar for Tasks

   - Requirements to consider changing, make duplicate Tasks allowable so user can organize 
     reoccurring tasks within same project.
   
   - Implement editing a task
   - Implement deleting a task

   - Design problems to fix: 
      - Separate the EventListeners into a separate file
      - Make sure to remove event listeners added to DOM elements when removing their
        elements to prevent memory leak issues
*/

//Load projectlist from localStorage, if null initialize empty project list
let todoListProjects;
try {
  todoListProjects = LocalStorage.convertStringObjectToProjectList(JSON.parse(localStorage.getItem('projectList')));
} catch (e) {
  console.error(e.message, e.name);
}

//Check whether localStorage does not contain a saved todo project list or empty list
if (!todoListProjects || todoListProjects.getProjects().length === 0) {
  initProjectList();
  generalProjectEventListener();
} else {
  //Take every project that we got from local storage and populate them onto the UI
  todoListProjects.getProjects().forEach((p, index) => {
    //Display each project in left menu
    const pListElement = DOMUtil.appendChildToParent('li', 'div');
    const pContainerElement = pListElement.firstChild;
    const pButton = document.createElement('button');
    pContainerElement.appendChild(pButton);
    
    const pDeleteButton = document.createElement('button');
    pDeleteButton.classList.add('delete-project');
    pDeleteButton.setAttribute('onclick', 'deleteProject()');
    pDeleteButton.onclick = deleteProject;
    pDeleteButton.textContent = 'X';
    pContainerElement.append(pDeleteButton);
    
    pContainerElement.firstChild.textContent = p.getName();
    pContainerElement.classList.add('project-buttons-container');

    elements.projectList.append(pListElement);

    //When a new Project is created, add a click listener to display tasks when clicked
    pButton.addEventListener('click', viewProjectTasks, false);

    /*....Should we display the first project upon reload/refresh???
      ....Or maybe we should display Inbox or Today's tasks upon reload???
      ....For now we will display empty Task Section passing responsibility to 
      ....User to display whatever task he wants upon reload/refresh of the webpage
    */
    document.getElementById('task-list-header').textContent = "";
    if (index === 0) {null}
  });
}

onAddProjectEventListener();
onAddTaskEventListener();

/**
 * Activate event Listener on General project to display it's tasks
 */
 function generalProjectEventListener() {
  document.querySelector('.general').addEventListener('click', viewProjectTasks, false);
}

/**
 * Activates event listener on add project button for firing off a series of logical events
 * that should follow clicking the add project button
 */
function onAddProjectEventListener() {
  elements.addProjectButton.addEventListener('click', initAddProjectEvent);
}

/**
 * Listens for clicks on add Task button for the appropriate Project currently being viewed.
 * Then fires off a series of logical consequences as a result of clicking the add task button.
 */
function onAddTaskEventListener() {
  document.querySelector('.add-task').addEventListener('click', initAddTaskEvent, false);
}

/**
 * Adds event listener for the create button that adds a project to the list of projects.
 */
 function createProjectEventListener() {
  elements.createButton.addEventListener('click', addProject);
}

/**
 * Adds event listener for the cancel button that cancels the creating of a new project.
 */
 function cancelCreatingNewProjectEventListener() {
  elements.cancelButton.addEventListener('click', restoreAddProjectButtonDisplay);
}

/**
 * Adds event listener that listens for clicks on the create new task button to add new tasks.
 */
function createNewTaskEventListener() {
    document.getElementById('task-form').addEventListener('submit', addNewTask, false);
}

/**
 * Add event listener for canceling the creating of a new task.
 */
function addCancelCreatingNewTaskEventListener() {
  document.querySelector(".cancel-task").addEventListener('click', removeCreatingNewTaskForm, false);
}

/**
 * Initialize project list and returns a ProjectList object that contains the default General project.
 * @returns ProjectList object that contains the default General project
 */
 function initProjectList() {
  const projects = new ProjectList();
  
  const general = projectfactory("General");
  projects.addProject(general);

  document.querySelector(".general-list-item").style.display = "list-item";

  //Init the X cancel span element with a click event listener that deletes general project
  const generalDelete = document.querySelector(".delete-project");
  generalDelete.setAttribute('onclick', 'deleteProject()');
  generalDelete.onclick = deleteProject;

  todoListProjects = projects;
  localStorage.setItem('projectList', JSON.stringify(LocalStorage.convertProjectListToStringObject(todoListProjects)));
}

function initAddProjectEvent() {
  // Add Project button disappears temporarily, Input text field appears
  document.getElementById('add-project-button').remove();
  elements.addProjectInputContainer.style.display = "block";
  
  //..Insert a way to make the input field focus or show cursor for typing text in after click
  //..add project event gets initiated

  cancelCreatingNewProjectEventListener();
  createProjectEventListener();
}

function initAddTaskEvent() {
  //If no project is selected return message to user to select a project
  //Check if project header is selected if not user is prompted to select an existing project
  //or create new one and select it before adding tasks
  if (document.getElementById('task-list-header').textContent === "" || 
      document.getElementById('task-list-header').textContent === undefined) {
        alert("Must select a project before adding tasks.");
        return;
  }

  // window is displayed with input formatted form entries
  document.querySelector(".task-form").style.display = 'block';

  //make sure that projects cannot be selected 

  // user may click exit X button
  addCancelCreatingNewTaskEventListener();

  // user may click create new task button
  createNewTaskEventListener();

}

/**
 * Adds a new Task to the list of Tasks under the appropriate Project. Returns
 * 'Invalid Task' if new Task was invalid.
 * 
 * @param {Event} e event which called this method
 * @returns Invalid task if task was not a valid task or true if valid task was added
 */
function addNewTask(e) {
  //Prevent default submit event behavior
  e.preventDefault();

  // Validate Task
  let newTask;
  try {
    newTask = validateTask();
  } catch (e) {
    console.log(e.message, e.name);
    // Alert user if type of error is a duplicate Task title
    if (e.message === 'Duplicate Task title')
      alert('Task already exists.');
    return 'Invalid Task';
  }
  // If Task is valid, let's clear the form display
  removeCreatingNewTaskForm();

  // Add newTask in the Project's list of Tasks which is under the todoListProjects
  let taskToBeAdded = taskfactory(newTask.title.trim(), newTask.date, newTask.priority, newTask.description);
  let projectToUpdate = todoListProjects.getProject(newTask.projectname);
  projectToUpdate.addTask(taskToBeAdded);

  todoListProjects.setProject(newTask.projectname, projectToUpdate);
  localStorage.setItem('projectList', JSON.stringify(LocalStorage.convertProjectListToStringObject(todoListProjects)));

  // Populate the newTask in the list of tasks under the Project header
  // Display Valid Task under project heading
  const taskList = document.getElementById('task-list');

  const taskListItem = document.createElement('li');
  taskListItem.textContent = taskToBeAdded.getTaskInfo();
  taskList.appendChild(taskListItem);
}

function validateTask() {
  //Store values in variables and check their validity
  const taskName = document.getElementById('name').value;
  const taskDueDate = document.getElementById('date').value;
  const taskDescription = document.getElementById('description').value;
  const taskPriority = [...document.getElementsByName('priority')].filter(element => {
    return (element.checked === true) ? true : false;
  });

  const projectName = document.getElementById('task-list-header').textContent;
  
  const filteredTasks = todoListProjects.getProject(projectName).getTasks().filter(t => {
    return (t.getName().trim() === taskName.trim()) ? true : false;
  });

  //Check for empty task name & duplicate task names
  if (taskName === "" || taskName === undefined || taskName === null)
    throw new UserException('Invalid Task title');
  if (filteredTasks.length > 0)
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

/**
 * Adds a newly created project to the project list and restores view of left menu
 * @returns 'Duplicate' if element is duplicate, false if blank project, or true if project
 *          added successfully
 */
 function addProject() {
  if (elements.addProjectInput.value === "") {
    alert("Project name cannot be blank");
    return false;
  }

  const project = new Project(elements.addProjectInput.value);

  if (todoListProjects.addProject(project) === "Duplicate") 
    return 'Duplicate'; //alert is handled in project-list object
  
  localStorage.setItem('projectList', JSON.stringify(LocalStorage.convertProjectListToStringObject(todoListProjects)));

  // Call cancel event handler function to remove input and create/cancel buttons
  restoreAddProjectButtonDisplay();

  // Append projectElement to the list in the left-hand side menu
  const pListElement = DOMUtil.appendChildToParent('li', 'div');
  const pContainerElement = pListElement.firstChild;
  const pButton = document.createElement('button');
  pContainerElement.appendChild(pButton);
  
  const pDeleteButton = document.createElement('button');
  pDeleteButton.classList.add('delete-project');
  pDeleteButton.setAttribute('onclick', 'deleteProject()');
  pDeleteButton.onclick = deleteProject;
  pDeleteButton.textContent = 'X';
  pContainerElement.append(pDeleteButton);

  pContainerElement.firstChild.textContent = project.getName();
  pContainerElement.classList.add('project-buttons-container');

  elements.projectList.append(pListElement);

  //When a new Project is created, add a click listener to display tasks when clicked
  pButton.addEventListener('click', viewProjectTasks, false);

  return true;
}

function viewProjectTasks(event) {
  //First check if Project Tasks is already being displayed, therefore just return exit function
  if (event.target.textContent === document.getElementById('task-list-header').textContent)
    return 'Project already displayed';

  //Clear current project's task View by deleting all childNodes
  if (elements.taskList.hasChildNodes)
    DOMUtil.removeAllChildNodes(elements.taskList);

  //Change header name to current project name
  const projectName = event.target.textContent;
  document.getElementById('task-list-header').textContent = projectName;

  //Check if project has any tasks, if not return
  if (todoListProjects.getProject(projectName).getTasks().length === 0)
    return 'Project does not contain any Tasks';

  //Populate task list with current project
  todoListProjects.getProject(projectName).getTasks().forEach(t => {
    //...We need to change this to a better design for displaying Tasks
    const taskListItem = document.createElement('li');
    taskListItem.textContent = t.getTaskInfo();
    elements.taskList.appendChild(taskListItem);
  });
}

/**
 * Deletes the project that fired off this event, removing it from the project lists and HTML DOM.
 * @param {Event} event event signaled or fired
 */
function deleteProject(event) {
  //Removes the last character from textContent, example 'GeneralX' becomes 'General'
  const projectName = event.path[1].textContent.slice(0, -1);

  //If project to delete is in process of adding a task from form, clear the new task form
  if (projectName === document.getElementById('task-list-header').textContent
      && document.querySelector('.task-form').style.display === 'block') {
    removeCreatingNewTaskForm();
  }

  // If this project is currently displayed, remove it from view
  if (projectName === document.getElementById('task-list-header').textContent) {
    document.getElementById('task-list-header').textContent = "";
    DOMUtil.removeAllChildNodes(elements.taskList);
  }

  // Remove from DOM and it's viewProjectTasks event listener
  event.path[2].removeEventListener('click', viewProjectTasks, false);
  todoListProjects.removeProject(projectName);
  event.path[2].remove();

  localStorage.setItem('projectList', JSON.stringify(LocalStorage.convertProjectListToStringObject(todoListProjects)));
}

/**
 * Handles an event where user clicks on the cancel button when creating a new project by
 * restoring the previous display of add project button without the text input form.
 */
function restoreAddProjectButtonDisplay() {
  // Hides and input and create/cancel display takes no space
  elements.addProjectInput.value = "";
  elements.addProjectInputContainer.style.display = "none";

  // Restores the Add Project Button and it's add project event listener
  const newAddProjectButton = elements.leftMenuContainer.appendChild(document.createElement('button'));
  newAddProjectButton.setAttribute('id', "add-project-button");
  newAddProjectButton.textContent = "Add Project";
  newAddProjectButton.addEventListener('click', initAddProjectEvent);
}

function removeCreatingNewTaskForm() {
  //Clear all input fields
  document.getElementById('name').value = "";
  document.getElementById('date').value = "";
  document.getElementById('description').value = "";

  //Both of these methods clear radio buttons using checked property
  //Convert nodelist into array to execute Array.map function
  [...document.getElementsByName('priority')].map(element => element.checked = false);
  //Or use forEach function for nodelists that can iterate these types of objects
  document.getElementsByName('priority').forEach(element => element.checked = false);

  //Get rid of the Task display
  document.querySelector('.task-form').style.display = 'none';
}