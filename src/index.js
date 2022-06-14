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

let isProjectMoreOptionsDropdownDisplayed = false;
let projectNameWhereMoreOptionsDropdownDisplayed = undefined;

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
   - Implement a popup div that displays a message upon project creation, deletion or task
     creation or deletion for a limited interval of time then dissappears. You can also have an
     undo button attached to this message to revert back to original state before action. This
     requires a click event handler that will undo whatever change occurred.
   - Implement a settings icon top right that can adjust certain features to user's liking
   - Implement animations on svg icons and other elements such as checkboxes on Tasks

   - Requirements to consider changing, make duplicate Tasks allowable so user can organize 
     reoccurring tasks within same project.
   
   - Implement editing a task
   - Implement deleting a task

   - Design problems to fix: 
      - Separate the EventListeners into a separate file
      - Make sure to remove event listeners added to DOM elements when removing their
        elements to prevent memory leak issues
      - Project dynamic id attribute values may become a problem if user creates a project
        with the same name as an existing id in the HTML document like "on-add-project". highly
        unlikely but may occurr. Potential bug that could break our app
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
    appendProjectToList(p.getName());
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
 * Add event listener for handling clicks outside of project more options dropdown anywhere 
 * in the body which will cause the dropdown to dissappear or display: none.
 */
function addDocumentClearProjectMoreOptionsDropdownEventListener() {
  document.body.addEventListener('click', clearProjectMoreOptionsDropdownDisplay, false);
}

/**
 * Removes event listener used for handling clicks outside of project more options dropdown.
 */
function removeDocumentClearProjectMoreOptionsDropdownEventListener() {
  document.body.removeEventListener('click', clearProjectMoreOptionsDropdownDisplay, false);
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

function initAddProjectEvent() {
  // Add Project button disappears temporarily, Input text field appears
  elements.addProjectInputContainer.style.display = "block";

  // Remove event Listener while creating new project form is active and displayed
  elements.addProjectButton.removeEventListener('click', initAddProjectEvent);
  
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

  // Update task Count in left menu project list
  const projectButtonElement = document.getElementById(newTask.projectname);
  const projectTaskCountElement = projectButtonElement.querySelector('.project-task-count-icon');
  projectTaskCountElement.textContent++;

  //Populate and display the newTask in the list of tasks under the Project header
  displayTask(newTask.title, newTask.date, newTask.priority);
}

/**
 * Display and append the Task with the given informaiton to the list of Tasks in the todo-list
 * content section.
 * 
 * @param {String} title title or name of the Task to display
 * @param {String} date date of the Task to display in "yyyy-mm-dd" format
 * @param {String} priority priority of Task to display; 'Normal', 'High', or 'Low'
 */
function displayTask(title, date, priority) {
  //...Add parametar title, date, priority validity checking
  //...Validation not required because task has already been validated in the addTask method

  //Populate and display the Task in the list of tasks under the Project header
  const taskList = document.getElementById('task-list');

  const taskListItem = document.createElement('li');
  taskListItem.classList.add('task-item');

  const taskContainer = document.createElement('div');
  taskContainer.classList.add('task-container');

  const taskCheckbox = document.createElement('div');
  taskCheckbox.classList.add('task-checkbox');

  const taskTitle = document.createElement('div');
  taskTitle.classList.add('task-title');
  taskTitle.textContent = title.trim();

  // "yyyy-mm-dd" format stored in from input date value
  const taskDate = document.createElement('div');
  taskDate.classList.add('task-date');
  taskDate.textContent = date.slice(5, 7) + '/' + date.slice(8, 10) + '/' + date.slice(0, 4);

  const taskFlagPriority = document.createElement('div');
  taskFlagPriority.classList.add('task-flag-priority');
  //add flag svg
  const flagSVG = document.createElementNS("http://www.w3.org/2000/svg",'svg');
  const flagPath = document.createElementNS("http://www.w3.org/2000/svg",'path');
  DOMUtil.setAttributes(flagSVG, { //Let's see if setting the attributes without NS works
    "height": "34px",
    "width": "34px",
    "id": "Layer_1",
    "version": "1.1",
    "viewBox": "0 0 512 512",
    "xmlns": "http://www.w3.org/2000/svg",
  });
  flagPath.setAttribute('d', "M368,112c-11,1.4-24.9,3.5-39.7,3.5c-23.1,0-44-5.7-65.2-10.2c-21.5-4.6-43.7-9.3-67.2-9.3c-46.9,0-62.8,10.1-64.4,11.2   l-3.4,2.4v2.6v161.7V416h16V272.7c6-2.5,21.8-6.9,51.9-6.9c21.8,0,42.2,8.3,63.9,13c22,4.7,44.8,9.6,69.5,9.6   c14.7,0,27.7-2,38.7-3.3c6-0.7,11.3-1.4,16-2.2V126v-16.5C379.4,110.4,374,111.2,368,112z");
  taskFlagPriority.appendChild(flagSVG).appendChild(flagPath);

  //If normal green, if high yellow, if low silver
  switch(priority) {
    case "High":
      taskFlagPriority.style.fill = '#ffef00';
      break;
    case "Normal":
      taskFlagPriority.style.fill = 'rgb(49, 194, 146)';
      break;
    case "Low":
      taskFlagPriority.style.fill = '#c9ced2';
      break;
  }

  const taskEdit = document.createElement('div');
  taskEdit.classList.add('task-edit');
  //add task edit svg
  const editSVG = document.createElementNS("http://www.w3.org/2000/svg",'svg');
  const editPath = document.createElementNS("http://www.w3.org/2000/svg",'path');
  DOMUtil.setAttributes(editSVG, { //Let's see if setting the attributes without NS works
    "height": "24px",
    "width": "24px",
    "id": "Layer_1",
    "version": "1.1",
    "viewBox": "0 0 24 24",
    "xmlns": "http://www.w3.org/2000/svg",
  });
  editPath.setAttribute('d', "M21.635,6.366c-0.467-0.772-1.043-1.528-1.748-2.229c-0.713-0.708-1.482-1.288-2.269-1.754L19,1C19,1,21,1,22,2S23,5,23,5  L21.635,6.366z M10,18H6v-4l0.48-0.48c0.813,0.385,1.621,0.926,2.348,1.652c0.728,0.729,1.268,1.535,1.652,2.348L10,18z M20.48,7.52  l-8.846,8.845c-0.467-0.771-1.043-1.529-1.748-2.229c-0.712-0.709-1.482-1.288-2.269-1.754L16.48,3.52  c0.813,0.383,1.621,0.924,2.348,1.651C19.557,5.899,20.097,6.707,20.48,7.52z M4,4v16h16v-7l3-3.038V21c0,1.105-0.896,2-2,2H3  c-1.104,0-2-0.895-2-2V3c0-1.104,0.896-2,2-2h11.01l-3.001,3H4z");
  taskEdit.appendChild(editSVG).appendChild(editPath);

  const taskTrash = document.createElement('div');
  taskTrash.classList.add('task-trash');
  //add task Trash svg
  const trashSVG = document.createElementNS("http://www.w3.org/2000/svg",'svg');
  const trashPath = document.createElementNS("http://www.w3.org/2000/svg",'path');
  DOMUtil.setAttributes(trashSVG, {
    "height": "23px",
    "width": "23px",
    "viewBox": "0 0 448 512",
    "xmlns": "http://www.w3.org/2000/svg",
  });
  trashPath.setAttribute('d', "M32 464C32 490.5 53.5 512 80 512h288c26.5 0 48-21.5 48-48V128H32V464zM304 208C304 199.1 311.1 192 320 192s16 7.125 16 16v224c0 8.875-7.125 16-16 16s-16-7.125-16-16V208zM208 208C208 199.1 215.1 192 224 192s16 7.125 16 16v224c0 8.875-7.125 16-16 16s-16-7.125-16-16V208zM112 208C112 199.1 119.1 192 128 192s16 7.125 16 16v224C144 440.9 136.9 448 128 448s-16-7.125-16-16V208zM432 32H320l-11.58-23.16c-2.709-5.42-8.25-8.844-14.31-8.844H153.9c-6.061 0-11.6 3.424-14.31 8.844L128 32H16c-8.836 0-16 7.162-16 16V80c0 8.836 7.164 16 16 16h416c8.838 0 16-7.164 16-16V48C448 39.16 440.8 32 432 32z");
  taskTrash.appendChild(trashSVG).appendChild(trashPath);

  //Append Task list item and Task container content to the Task list
  taskList.appendChild(taskListItem).appendChild(taskContainer);
  DOMUtil.appendChildren(taskContainer, [taskCheckbox, taskTitle, taskDate, taskFlagPriority, taskEdit, taskTrash]);
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

  appendProjectToList(project.getName());
  return true;
}

function appendProjectToList(projectName) {
  // Append and display project element to list in left-hand side menu
  const pListElement = DOMUtil.appendChildToParent('li', 'div');
  const pContainerElement = pListElement.firstChild;
  const pButton = document.createElement('button');
  pContainerElement.appendChild(pButton);

  const projectMoreOptionsButton = document.createElement('button');
  projectMoreOptionsButton.classList.add('project-more-options');

  const threeDotIcon = document.createElement('div');
  threeDotIcon.classList.add('project-3dot-icon');
  projectMoreOptionsButton.appendChild(threeDotIcon);
  pContainerElement.appendChild(projectMoreOptionsButton);
  projectMoreOptionsButton.addEventListener('click', displayProjectMoreOptions, false);

  pContainerElement.firstChild.textContent = projectName;
  pContainerElement.classList.add('project-buttons-container');

  pContainerElement.firstChild.classList.add('project-button');
  const pIcon = document.createElement('div');
  pIcon.classList.add('project-icon');
  pContainerElement.firstChild.insertBefore(pIcon, pContainerElement.firstChild.firstChild);

  const pTaskCount = document.createElement('div');
  pTaskCount.classList.add('project-task-count-icon');
  pTaskCount.textContent = todoListProjects.getProject(projectName).getTaskCount();
  pContainerElement.firstChild.appendChild(pTaskCount);

  pContainerElement.firstChild.setAttribute('id', projectName);

  elements.projectList.appendChild(pListElement);

  //When a new Project is created, add a click listener to display tasks when clicked
  pButton.addEventListener('click', viewProjectTasks, false);
}

function viewProjectTasks(event) {
  const projectName = event.target.getAttribute('id');
  
  //First check if Project Tasks is already being displayed, therefore just return exit function
  if (projectName === document.getElementById('task-list-header').textContent)
    return 'Project already displayed';

  //Clear current project's task View by deleting all childNodes
  if (elements.taskList.hasChildNodes)
    DOMUtil.removeAllChildNodes(elements.taskList);

  //Change header name to current project name
  document.getElementById('task-list-header').textContent = projectName;

  //Check if project has any tasks, if not return
  if (todoListProjects.getProject(projectName).getTasks().length === 0)
    return 'Project does not contain any Tasks';

  //Populate task list with current project
  todoListProjects.getProject(projectName).getTasks().forEach(t => {
    displayTask(t.getName(), t.getDueDate(), t.getPriority());
  });
}

/**
 * Display project more options dropdown menu which contains rename & delete project operations.
 */
 function displayProjectMoreOptions(event) {
  const projectName = event.path[1].firstElementChild.getAttribute('id');
  
  // Check first if project more options is already there displayed as none or display
  // Update flags used by body click event listener & add/remove listener based on display prop
  if (event.path[1].childElementCount >= 3) {
    if (event.path[1].lastElementChild.style.display === "none") {
      //Before displaying a new dropdown check to see if one exits, clear if true
      if (isProjectMoreOptionsDropdownDisplayed)
        clearDuplicateProjectMoreOptionsDropdownDisplay();
      event.path[1].lastElementChild.style.display = "block";
      isProjectMoreOptionsDropdownDisplayed = true;
      projectNameWhereMoreOptionsDropdownDisplayed = projectName;
      addDocumentClearProjectMoreOptionsDropdownEventListener();
    } else {
      event.path[1].lastElementChild.style.display = "none";
      isProjectMoreOptionsDropdownDisplayed = false;
      projectNameWhereMoreOptionsDropdownDisplayed = undefined;
      removeDocumentClearProjectMoreOptionsDropdownEventListener();
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

  //... ... ...Rename event listener, needs implementation
  renameButton.setAttribute('onclick', 'initRenameProjectEvent()');
  renameButton.onclick = initRenameProjectEvent;

  deleteButton.setAttribute('onclick', 'deleteProject()');
  deleteButton.onclick = deleteProject;

  //Set unique id attribute for our unique project dropdown
  //..........Throwing null reference sometimes, look into bug fix
  projectDropdownContainer.setAttribute('id', projectName.concat("-more-options-dropdown"));   

  //Append dropdown more options to DOM 
  //Update flags used by body click event listener & add/remove listener based on display prop
  //Before displaying a new dropdown check to see if one exits, clear if true
  if (isProjectMoreOptionsDropdownDisplayed)
    clearDuplicateProjectMoreOptionsDropdownDisplay();
  event.path[1].appendChild(projectDropdownContainer);
  isProjectMoreOptionsDropdownDisplayed =  true;
  projectNameWhereMoreOptionsDropdownDisplayed = projectName;
  addDocumentClearProjectMoreOptionsDropdownEventListener();
}

function clearDuplicateProjectMoreOptionsDropdownDisplay() {
  const projectButton = document.getElementById(projectNameWhereMoreOptionsDropdownDisplayed);
  projectButton.parentElement.lastElementChild.style.display = 'none';
}

function clearProjectMoreOptionsDropdownDisplay(event) {
  if (isProjectMoreOptionsDropdownDisplayed) {
    //Check to see if event.target is coming from 3dot icon or delete or rename buttons
    const eventTargetClassName = event.target.getAttribute('class');
    if (eventTargetClassName !== 'project-more-options' &&
        eventTargetClassName !== 'rename-item' &&
        eventTargetClassName !== 'delete-item') {
      //Find dropdown project display container using project name used as id attribute value
      const projectButton = document.getElementById(projectNameWhereMoreOptionsDropdownDisplayed);
      projectButton.parentElement.lastElementChild.style.display = 'none';
    }
  }
}

/**
 * Renames the project that fired off this event
 * @param {Event} event event signaled or fired
 */
function initRenameProjectEvent(event) {
  // Remove project more options dropdown display 
  // Update flags used by body click event listener & add/remove listener based on display prop
  event.path[2].style.display = 'none';
  isProjectMoreOptionsDropdownDisplayed = false;
  projectNameWhereMoreOptionsDropdownDisplayed = undefined;
  removeDocumentClearProjectMoreOptionsDropdownEventListener();
}

/**
 * Deletes the project that fired off this event, removing it from the project lists and HTML DOM.
 * @param {Event} event event signaled or fired
 */
function deleteProject(event) {
  // Remove project more options dropdown display
  // Update flags used by body click event listener & add/remove listener based on display prop
  event.path[2].style.display = 'none';
  isProjectMoreOptionsDropdownDisplayed = false;
  projectNameWhereMoreOptionsDropdownDisplayed = undefined;
  removeDocumentClearProjectMoreOptionsDropdownEventListener();

  const projectName = event.path[3].firstElementChild.getAttribute('id');

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
  // ..This may not be needed, plus event listener added on event.path[3].firstElementChild not
  // ..event.path[4] which is list item
  event.path[3].firstElementChild.removeEventListener('click', viewProjectTasks, false);

  todoListProjects.removeProject(projectName);
  event.path[4].remove();

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

  // No need to redo creation of add-project button, just restore add project event listener
  elements.addProjectButton.addEventListener('click', initAddProjectEvent);
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