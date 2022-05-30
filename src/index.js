import { formatDistanceStrict } from 'date-fns';
import './style.sass';
import Project, {projectFactory as projectfactory} from './project';
import Task, {taskfactory} from './task';
import * as DOMUtil from './dom-util';
import ProjectList from './project-list';

const elements = {
  addProjectInputContainer: document.getElementById("on-add-project"),
  addProjectInput: document.getElementById("create-project"),
  addProjectButton: document.getElementById("add-project-button"),
  leftMenuContainer: document.querySelector(".left-menu"),
  projectList: document.getElementById("project-list"),
  cancelButton: document.getElementById("cancel-on-add-project"),
  createButton: document.getElementById("create-on-add-project")
}

const todoListProjects = initProjectList();
initTodoListUI();

function initTodoListUI() {
  /*These functions need to go into a separate module for initializing the todo List UI*/
  //listens for clicks on add Project button to display user input field to add project
  onAddProjectEventListener();
  //listens for clicks on general button; displays general project tasks on fire
  generalProjectEventListener();
  //listens for clicks on add Task button for given the appropriate Project currently being viewed
  onAddTaskEventListener();
}

/**
 * Listens for clicks on add Task button for given the appropriate Project currently being viewed
 */
function onAddTaskEventListener() {
}

/**
 * Activate event Listener on General project to display it's tasks
 */
function generalProjectEventListener() {
}

/**
 * Initialize project list and returns a ProjectList object that contains the default General project.
 * @returns ProjectList object that contains the default General project
 */
function initProjectList() {
  const projects = new ProjectList();
  
  const general = projectfactory("General");
  projects.addProject(general);

  const generalDelete = document.querySelector(".delete-project");
  generalDelete.setAttribute('onclick', 'deleteProject()');
  generalDelete.onclick = deleteProject;
  //... Add Event Listener here for General project to listen for clicks on general project
  //... for displaying tasks

  return projects;
}

function onAddProjectEventListener() {
  elements.addProjectButton.addEventListener('click', initAddProjectEvent);
}
function initAddProjectEvent() {
  // Add Project button disappears temporarily, Input text field appears
  document.getElementById('add-project-button').remove();
  elements.addProjectInputContainer.style.display = "block";

  cancelProjectEventListener();
  createProjectEventListener();
}

/**
 * Deletes the project that fired off this event, removing it from the project lists and HTML DOM.
 * @param {Event} event event signaled or fired
 */
function deleteProject(event) {
  const text = event.path[1].textContent.replace(/\s/g, "");
  const projectName = text.slice(0, text.length - 1);

  todoListProjects.removeProject(projectName);
  event.path[2].remove();
}

function cancelProjectEventListener() {
  elements.cancelButton.addEventListener('click', cancelOnAddProject);
}

function cancelOnAddProject() {
  // Hides and input and create/cancel display takes no space
  elements.addProjectInput.value = "";
  elements.addProjectInputContainer.style.display = "none";

  // Restores the Add Project Button and it's add project event listener
  const newAddProjectButton = elements.leftMenuContainer.appendChild(document.createElement('button'));
  newAddProjectButton.setAttribute('id', "add-project-button");
  newAddProjectButton.textContent = "Add Project";
  newAddProjectButton.addEventListener('click', initAddProjectEvent);
}

function createProjectEventListener() {
  elements.createButton.addEventListener('click', addProject);
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
  cancelOnAddProject();

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


  return true;
}

// I need a place where I can store projects data and retrieve when I need it like a database
// or some type of server that saves and retrieves information only when I need it


// User clicks add task button (requires click event listener)
// window is displayed with input formatted form entries
// user enters required values
// user clicks complete
// task is created
// task is displayed in page under project heading

