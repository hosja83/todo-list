import { formatDistanceStrict } from 'date-fns';
import './style.sass';
import Project, {projectFactory as projectfactory} from './project';
import Task, {taskfactory} from './task';
import * as DOMUtil from './dom-util';
import ProjectList from './project-list';
import * as LocalStorage from './local-storage';

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
    const pElement = DOMUtil.appendChildToParent('li', 'button');
    pElement.firstChild.textContent = p.getName();
    
    const xSpan = document.createElement('span');
    xSpan.classList.add('delete-project');
    xSpan.setAttribute('onclick', 'deleteProject()');
    xSpan.onclick = deleteProject;
    xSpan.textContent = 'X';

    pElement.firstChild.append(xSpan);
    elements.projectList.append(pElement);

    //Add Event Listener that handles clicks on project to display tasks
    pElement.addEventListener('click', viewProjectTasks, false);

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
 * Adds event listener for the cancel button that cancels the creating of a new project.
 */
 function cancelCreatingNewProjectEventListener() {
  elements.cancelButton.addEventListener('click', restoreAddProjectButtonDisplay);
}
/**
 * Adds event listener for the create button that adds a project to the list of projects.
 */
function createProjectEventListener() {
  elements.createButton.addEventListener('click', addProject);
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
      document.getElementById('task-list-header').textContent === undefined)
        alert("Must select a project before adding tasks.");
  
  // window is displayed with input formatted form entries
  // user enters required values
  // user clicks complete
  // task is created
  // task is displayed in page under project heading

  //...Display a fixed window overlapping area where tasks are displayed that as a form
  //...With a list of fields for creating a new task

  //...There should be an exit X button in the top right to cancel task creating
  //...And there should be create Task button in the bottom to finish creating Task

  //...Make sure that all required fields are filled before task creation

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
    return 'Duplicate';
  
  localStorage.setItem('projectList', JSON.stringify(LocalStorage.convertProjectListToStringObject(todoListProjects)));

  // Call cancel event handler function to remove input and create/cancel buttons
  restoreAddProjectButtonDisplay();

  // Append projectElement to the list in the left-hand side menu
  const projectElement = DOMUtil.appendChildToParent('li', 'button');
  projectElement.firstChild.textContent = project.getName();
  
  // Add delete project X span, deleteProject click attribute, delete project class
  const xSpan = document.createElement('span');
  xSpan.classList.add('delete-project');
  xSpan.setAttribute('onclick', 'deleteProject()');
  xSpan.onclick = deleteProject;
  xSpan.textContent = 'X';

  // Append xSpan to new project button and project to project list in left menu
  projectElement.firstChild.append(xSpan);
  elements.projectList.append(projectElement);

  //When a new Project is created, add a click listener to display tasks when clicked
  projectElement.addEventListener('click', viewProjectTasks, false);

  return true;
}



function viewProjectTasks(event) {
  //First clear current project's task View
  if (elements.taskList.hasChildNodes) {
    // delete all childNodes
    DOMUtil.removeAllChildNodes(elements.taskList);
  }

  //Change header name to current project name
  const projectName = event.target.textContent.slice(0, -1);
  document.getElementById('task-list-header').textContent = projectName;

  //...Populate task list with current project

}

/**
 * Deletes the project that fired off this event, removing it from the project lists and HTML DOM.
 * @param {Event} event event signaled or fired
 */
function deleteProject(event) {
  //Removes the last character from textContent, example 'GeneralX' becomes 'General'
  const projectName = event.path[1].textContent.slice(0, -1);

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