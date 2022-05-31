import { formatDistanceStrict } from 'date-fns';
import './style.sass';
import Project, {projectFactory as projectfactory} from './project';
import Task, {taskfactory} from './task';
import * as DOMUtil from './dom-util';
import ProjectList from './project-list';
import * as LocalStorage from './local-storage';

// I need a place where I can store projects data and retrieve when I need it like a database
// or some type of server that saves and retrieves information only when I need it

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

//First thing after page loads
//We must load all projects from localStorage
//populate our DOM with these lists of projects
//add event listeners to all these projects including general to display their tasks,
//Each project tasks must be retrieved from localStorage if user clicks on project and, 
//these tasks should be displayed along with the project header
//default display should always show General project when user refreshes or after browser closes

const todoListProjects = initProjectList();
initTodoListUI();

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

function initTodoListUI() {
  /*These functions need to go into a separate module for initializing the todo List UI*/

  //listens for clicks on general button; displays general project tasks on fire
  generalProjectEventListener();
  //listens for clicks on add Project button to display user input field to add project
  onAddProjectEventListener();
  //listens for clicks on add Task button for given the appropriate Project currently being viewed
  onAddTaskEventListener();
}

/**
 * Initialize project list and returns a ProjectList object that contains the default General project.
 * @returns ProjectList object that contains the default General project
 */
 function initProjectList() {
  const projects = new ProjectList();
  
  const general = projectfactory("General");
  projects.addProject(general);

  //...Before storing in localStorage convert Project/Task objects into String objects

  //Init the X cancel span element with a click event listener that deletes general project
  const generalDelete = document.querySelector(".delete-project");
  generalDelete.setAttribute('onclick', 'deleteProject()');
  generalDelete.onclick = deleteProject;

  return projects;
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

  //...Everytime a new Project is created, add a click event listener for that project button
  //...to display tasks when clicked
  projectElement.name = project.getName();
  projectElement.addEventListener('click', viewProjectTasks, false);

  return true;
}

function initAddTaskEvent() {
  //If no project is selected return message to user to select a project
  //Check if project header is selected if not user is prompted to select an existing project
  //or create new one and select it before adding tasks
  if (document.getElementById('task-list-header').textContent === "" || 
      document.getElementById('task-list-header').textContent === undefined)
        alert("Must select a project before adding tasks.");
  
  // User clicks add task button (requires click event listener)
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