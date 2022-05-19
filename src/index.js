import { formatDistanceStrict } from 'date-fns';
import './style.sass';
import Project, {projectFactory as projectfactory} from './project';
import Task, {taskfactory} from './task';

onAddProjectEventListener();

//listens for clicks on general button; displays general project tasks on fire
generalProjectEventListener(); 

/**
 * Creates new elements with given tag names and appends parent element to child element.
 * Returns parent element with appended child.
 * 
 * @param {string} parentElementTagName tag name of parent element
 * @param {string} childElementTagName tag name of child element
 * @return {HTMLElement} returns parent element with appended child
 */
 function appendChildToParent(parentElementTagName, childElementTagName) {
  const parent = document.createElement(parentElementTagName);
  const child = document.createElement(childElementTagName);
  parent.appendChild(child);
  return parent;
} 

/**
 * Returns removed given element
 * 
 * @param {HTMLElement} element element to be removed
 * @returns {HTMLElement} removed element
 */
function removeElement(element) {
  return element.parentNode.removeChild(element);
}

function onAddProjectEventListener() {document.getElementById("add-project").addEventListener('click', initiateAddProjectEvent)}

function initiateAddProjectEvent() {
  // Add Project button disappears temporarily, Input text field appears
  const addProjectElement = removeElement(document.getElementById("add-project"));
  document.getElementById("on-add-project").style.display = "block";

  cancelProjectEventListener();
  createProjectEventListener();
}

function cancelProjectEventListener() {document.getElementById("cancel-on-add-project").addEventListener('click', cancelOnAddProject)}

function cancelOnAddProject() {
  const input = document.getElementById("create-project");
  input.value = "";

  document.getElementById("on-add-project").style.display = "none";

  const leftMenu = document.querySelector(".left-menu").appendChild(document.createElement('button'));
  leftMenu.setAttribute('id', "add-project");
  leftMenu.textContent = "Add Project";

  onAddProjectEventListener();
}

function createProjectEventListener() {document.getElementById("create-on-add-project").addEventListener('click', addProject)}

function addProject() {
  const input = document.getElementById("create-project");
  
  if (input.value === "") {
    alert("Project name cannot be blank");
    return false;
  }

  const projectName = input.value;
  const project = new Project(projectName);

  cancelOnAddProject();

  const projectElement = appendChildToParent('li', 'button');
  projectElement.firstChild.textContent = project.getName();
  document.getElementById("project-list").append(projectElement);

  //Everytime a new Project is created, add a click event listener for that project button
  //to display tasks when clicked 

}

// I need a place where I can store projects data and retrieve when I need it like a database
// or some type of server that saves and retrieves information only when I need it



// User clicks add task button (requires click event listener)
// window is displayed with input formatted form entries
// user enters required values
// user clicks complete
// task is created
// task is displayed in page under project heading



