import './style.sass';
import Project, {projectFactory as projectfactory} from './project';
import Task, {taskfactory} from './task';
import * as DOMUtil from './dom-util';
import ProjectList from './project-list';
import * as LocalStorage from './local-storage';
import UserException from './exception';

//npm install --save-dev @fortawesome/fontawesome-free

import '@fortawesome/fontawesome-free/js/all'

// import '@fortawesome/fontawesome-free/js/fontawesome';
// import '@fortawesome/fontawesome-free/js/solid';
// import '@fortawesome/fontawesome-free/js/regular';
// import '@fortawesome/fontawesome-free/js/brands';

//npm install --save-dev @fortawesome/fontawesome-svg-core @fortawesome/free-brands-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-solid-svg-icons

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

let taskInfoContainer, taskEditContainer;

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
   - Implement a restriction on only allowing one project rename operation at at time
   - Implement a date icon that allows user to edit date of Task by clicking on icon next to date
   - Implement a different subheading under a project called Events. Add subheadings under projects
     that distinguish between Tasks and Events. This will require adding an object class Event and
     rethinking UI display of application.
   - Implement a Calendar feature where you can view all events & tasks through a calendar UI
   - Implement subheadings under Projects to organize them into categories, have user freedom to 
     create customer categories under Projects organizing similar Projects together

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
      - When clicking dropdown more options under a project to delete or rename there is a void 
        where the relative/absolutely positioned dropdown container has left after being positioned
        that does not accept any UI interactivity. Not that big of a problem since clicking on it
        logically closes the dropdown but doesnt affect any thing else.
      - Change event.path methods to parentNode.parentNode.....etc.. for compatibility issues
      - Change child div elements of button to span elements
      - When task details container is displayed and task gets edited it does not update the 
        task details container that is displayed
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
displayFooter();

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
  document.getElementById('project-form').addEventListener('submit', addProject);
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
function addCreateNewTaskEventListener() {
  document.getElementById('task-form').addEventListener('submit', addNewTask, false);
}

/**
 * Adds event listener that listens for clicks/submissions on update task button.
 */
function addUpdateExistingTaskEventListener() {
  document.getElementById('task-form-edit').addEventListener('submit', updateTask, false);
}

/**
 * Add event listener for canceling the creating of a new task.
 */
function addCancelCreatingNewTaskEventListener() {
  document.querySelector(".cancel-task").addEventListener('click', removeCreatingNewTaskForm, false);
}

/**
 * Add event listener for canceling the editing of an existing task.
 */
function addCancelEditingExistingTaskEventListener() {
  document.querySelector('.cancel-task-edit').addEventListener('click', removeEditingExistingTaskForm, false);
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

  // Remove add task button event listener while task form is displayed & user is adding a new task
  document.getElementById('add-task-button').removeEventListener('click', initAddTaskEvent, false);

  // user may click exit X button
  addCancelCreatingNewTaskEventListener();

  // user may click create new task button
  addCreateNewTaskEventListener();

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
    newTask = validateNewTask();
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

  //Add Checkbox event listener that handles the event of a Task being completed
  taskCheckbox.addEventListener('click', handleTaskCompletion, false);

  const taskTitle = document.createElement('div');
  taskTitle.classList.add('task-title');
  taskTitle.textContent = title.trim();

  //Add Task name/title event listener that displays more details
  taskTitle.addEventListener('click', handleTaskDetailsDisplay, false);

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

  //Add task Edit event listener to allow user to edit the task
  taskEdit.addEventListener('click', initEditTaskEvent, false);

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

  //Add taskTrash event listener to handle deletion of Task
  taskTrash.addEventListener('click', deleteTask, false);

  //Append Task list item and Task container content to the Task list
  taskList.appendChild(taskListItem).appendChild(taskContainer);
  DOMUtil.appendChildren(taskContainer, [taskCheckbox, taskTitle, taskDate, taskFlagPriority, taskEdit, taskTrash]);
}

function handleTaskCompletion() {
  //Check if Task a line through or not, if line-through style is applied then undo line-thru and checkmark
  //If no line-through is found then, apply line-through style and put checkmar in box
}

function handleTaskDetailsDisplay(event) {
  // Locate accurate event parent Node up the tree from the event target
  let taskListItemContainer = event.target;
  do {
    taskListItemContainer = taskListItemContainer.parentNode;
  } while (!taskListItemContainer.classList.contains("task-item"));

  //Check if task detail display is displayed or hidden
  if (taskListItemContainer.childNodes.length > 1) { 
    taskListItemContainer.removeChild(taskListItemContainer.lastChild);
    return; //We handled event by removing task detail display in UI
  }

  //Retrieve task from todoList using UI textContent/information
  const task = todoListProjects.getProject(document.getElementById("task-list-header").textContent).getTask(event.target.textContent);
  
  //Create Task detail DOM HTML elements
  const taskDetails = document.createElement('div');
  taskDetails.classList.add('task-details');

  const titleDateContainer = document.createElement('div');
  titleDateContainer.classList.add('task-items-container');

  const priorityDescriptionContainer = document.createElement('div');
  priorityDescriptionContainer.classList.add('task-items-container');

  const titleTaskItem = document.createElement('div');
  const titleTaskItemBold = document.createElement('b');
  const taskTitle = document.createElement('span');
  titleTaskItem.classList.add('task-item');
  titleTaskItemBold.textContent = "Title: ";
  taskTitle.textContent = task.getName();

  const dueDateTaskItem = document.createElement('div');
  const dueDateTaskItemBold = document.createElement('b');
  const taskDueDate = document.createElement('span');
  dueDateTaskItem.classList.add('task-item');
  dueDateTaskItemBold.textContent = "Due Date: ";
  taskDueDate.textContent = task.getDueDate().slice(5, 7) + '/' + task.getDueDate().slice(8, 10) + '/' +
                            task.getDueDate().slice(0, 4);

  const priorityTaskItem = document.createElement('div');
  const priorityTaskItemBold = document.createElement('b');
  const taskPriority = document.createElement('span');
  priorityTaskItem.classList.add('task-item');
  priorityTaskItemBold.textContent = "Priority: ";
  taskPriority.textContent = task.getPriority();

  const descriptionTaskItem = document.createElement('div');
  const descriptionTaskItemBold = document.createElement('b');
  const taskDescription = document.createElement('span');
  descriptionTaskItem.classList.add('task-item');
  descriptionTaskItemBold.textContent = "Description: ";
  taskDescription.textContent = task.getDescription();

  //Append Task detail DOM HTML elements
  taskDetails.appendChild(titleDateContainer);
  taskDetails.appendChild(priorityDescriptionContainer);

  titleDateContainer.appendChild(titleTaskItem).appendChild(titleTaskItemBold);
  titleTaskItem.appendChild(taskTitle);

  titleDateContainer.appendChild(dueDateTaskItem).appendChild(dueDateTaskItemBold);
  dueDateTaskItem.appendChild(taskDueDate);

  priorityDescriptionContainer.appendChild(priorityTaskItem).appendChild(priorityTaskItemBold);
  priorityTaskItem.appendChild(taskPriority);

  priorityDescriptionContainer.appendChild(descriptionTaskItem).appendChild(descriptionTaskItemBold);
  descriptionTaskItem.appendChild(taskDescription);

  //Append taskDetails as child element 
  taskListItemContainer.appendChild(taskDetails);
}

function initEditTaskEvent(event) {
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
  taskEditContainer.removeEventListener('click', initEditTaskEvent, false);

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
  addCancelEditingExistingTaskEventListener();

  // user may click update task button
  addUpdateExistingTaskEventListener();
}

function updateTask() {
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
  removeEditingExistingTaskForm();
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
function deleteTask(event) {
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

/**
 * Adds a newly created project to the project list and restores view of left menu
 * @returns 'Duplicate' if element is duplicate, false if blank project, or true if project
 *          added successfully
 */
 function addProject() {
  if (elements.addProjectInput.value.trim() === "") {
    alert("Project name cannot be blank");
    return false;
  }

  const project = new Project(elements.addProjectInput.value.trim());

  if (todoListProjects.addProject(project) === "Duplicate") 
    return 'Duplicate'; //alert is handled in project-list object
  
  localStorage.setItem('projectList', JSON.stringify(LocalStorage.convertProjectListToStringObject(todoListProjects)));

  // Call cancel event handler function to remove input and create/cancel buttons
  restoreAddProjectButtonDisplay();

  appendProjectToList(project.getName());
  return true;
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

  //Dynamically create project-icon svg and append as child
  const pIconSVG = document.createElementNS("http://www.w3.org/2000/svg",'svg');
  DOMUtil.setAttributes(pIconSVG, {
    "version": "1.0",
    "xmlns": "http://www.w3.org/2000/svg",
    "width": "52px",
    "height": "45px",
    "viewBox": "0 0 338.000000 323.000000",
    "preserveAspectRatio": "xMidYMid meet",
  });
  const pIconG = document.createElementNS("http://www.w3.org/2000/svg",'g');
  DOMUtil.setAttributes(pIconG, {
    "transform": "translate(0.000000,323.000000) scale(0.050000,-0.050000)",
    "fill": "#437798",
    "stroke": "#437798",
  });
  const pIconPath1 = document.createElementNS("http://www.w3.org/2000/svg",'path');
  pIconPath1.setAttribute('d', "M2312 4281 l-182 -178 -75 68 c-92 85 -114 86 -193 5 -85 -87 -82 -98 77 -257 192 -192 195 -191 461 76 273 273 299 319 228 404 -78 93 -114 80 -316 -118z");
  const pIconPath2 = document.createElementNS("http://www.w3.org/2000/svg",'path');
  pIconPath2.setAttribute('d', "M2895 4258 c-37 -21 -44 -91 -22 -223 l12 -74 848 -6 847 -5 0 165 0 165 -825 -1 c-523 0 -838 -8 -860 -21z");
  const pIconPath3 = document.createElementNS("http://www.w3.org/2000/svg",'path');
  pIconPath3.setAttribute('d', "M2416 3515 c-37 -36 -114 -118 -173 -183 l-105 -118 -89 87 -89 87 -80 -78 c-104 -102 -104 -101 64 -267 190 -187 181 -189 463 99 276 284 289 306 217 383 -68 72 -126 69 -208 -10z");
  const pIconPath4 = document.createElementNS("http://www.w3.org/2000/svg",'path');
  pIconPath4.setAttribute('d', "M2889 3366 c-29 -29 -30 -252 -1 -280 10 -11 1692 -7 1692 3 0 6 0 79 0 161 l0 150 -829 0 c-749 0 -831 -3 -862 -34z");
  const pIconPath5 = document.createElementNS("http://www.w3.org/2000/svg",'path');
  pIconPath5.setAttribute('d', "M2099 2620 c-134 -37 -199 -119 -199 -251 0 -297 408 -358 501 -76 55 168 -134 373 -302 327z");
  const pIconPath6 = document.createElementNS("http://www.w3.org/2000/svg",'path');
  pIconPath6.setAttribute('d', "M3220 2520 c-170 -5 -322 -18 -338 -28 -24 -16 -21 -259 4 -284 3 -4 388 -8 855 -8 l849 -2 7 166 6 166 -536 0 c-296 0 -676 -4 -847 -10z");

  pIcon.appendChild(pIconSVG).appendChild(pIconG);
  DOMUtil.appendChildren(pIconG, [pIconPath1,pIconPath2,pIconPath3,pIconPath4,pIconPath5,pIconPath6]);


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

  //Check if there is Task Edit operation undergo currently, if so alert User
  //'Must complete or exit Edit Task form before viewing Project
  if (document.querySelector(".task-form-edit").style.display === 'block') {
    alert(`Complete or Exit "Edit Task Form" before viewing "${projectName}".`);
    return 'Edit Task ongoing';
  }

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

  renameButton.setAttribute('onclick', 'initRenameProjectEvent()');
  renameButton.onclick = initRenameProjectEvent;

  deleteButton.setAttribute('onclick', 'deleteProject()');
  deleteButton.onclick = deleteProject;   

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
  // Update flags used by body click event listener & remove listener based on display prop
  event.path[2].style.display = 'none';
  isProjectMoreOptionsDropdownDisplayed = false;
  projectNameWhereMoreOptionsDropdownDisplayed = undefined;
  removeDocumentClearProjectMoreOptionsDropdownEventListener();

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
    DOMUtil.removeAllChildNodes(elements.taskList);
  }

  //Add Rename/submit event listeners and cancel click event listeners
  renameCancelButton.addEventListener('click', function() {
    restoreProjectButtonDisplay(event, projectName, projectTaskCount, projectButton, projectMoreOptionsDropdownIcon);
  }, false);

  renameButton.addEventListener('click', function() {
    renameProject(event, projectName, projectTaskCount, projectButton, projectMoreOptionsDropdownIcon);
  }, false);

}

function renameProject(e, projectName, projectTaskCount, projectButton, projectMoreOptionsDropdownIcon) {
  //Take the new input value and validate that it's not empty
  const renameProjectInput = e.path[3].firstElementChild.firstElementChild.lastElementChild;
  if (renameProjectInput.value.trim() === "") {
    alert("Project name cannot be blank");
    return false;
  }
  //restore project button, icon, task count, and more options view
  restoreProjectButtonDisplay(e, renameProjectInput.value, 
                              projectTaskCount, projectButton, projectMoreOptionsDropdownIcon);

  //update project name in the todolist & localStorage
  todoListProjects.getProjects()[todoListProjects.getProjectIndex(projectName)].setName(renameProjectInput.value);

  localStorage.setItem('projectList', JSON.stringify(LocalStorage.convertProjectListToStringObject(todoListProjects)));
}

function restoreProjectButtonDisplay(event, projectName, projectTaskCount, projectButton, projectMoreOptionsDropdownIcon) {
  event.path[4].style.height = '49px'; // change project list item height back to original style

  //Restore given projectButton & projectMoreOptionsDropdown
  const projectButtonsContainer = event.path[3];
  projectButtonsContainer.removeChild(projectButtonsContainer.firstElementChild);

  projectButton.innerHTML = `<button class="project-button" id="${projectName}"><div class="project-icon"><svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="52px" height="45px" viewBox="0 0 338.000000 323.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,323.000000) scale(0.050000,-0.050000)" fill="#437798" stroke="#437798"><path d="M2312 4281 l-182 -178 -75 68 c-92 85 -114 86 -193 5 -85 -87 -82 -98 77 -257 192 -192 195 -191 461 76 273 273 299 319 228 404 -78 93 -114 80 -316 -118z"></path><path d="M2895 4258 c-37 -21 -44 -91 -22 -223 l12 -74 848 -6 847 -5 0 165 0 165 -825 -1 c-523 0 -838 -8 -860 -21z"></path><path d="M2416 3515 c-37 -36 -114 -118 -173 -183 l-105 -118 -89 87 -89 87 -80 -78 c-104 -102 -104 -101 64 -267 190 -187 181 -189 463 99 276 284 289 306 217 383 -68 72 -126 69 -208 -10z"></path><path d="M2889 3366 c-29 -29 -30 -252 -1 -280 10 -11 1692 -7 1692 3 0 6 0 79 0 161 l0 150 -829 0 c-749 0 -831 -3 -862 -34z"></path><path d="M2099 2620 c-134 -37 -199 -119 -199 -251 0 -297 408 -358 501 -76 55 168 -134 373 -302 327z"></path><path d="M3220 2520 c-170 -5 -322 -18 -338 -28 -24 -16 -21 -259 4 -284 3 -4 388 -8 855 -8 l849 -2 7 166 6 166 -536 0 c-296 0 -676 -4 -847 -10z"></path></g></svg></div>${projectName}<div class="project-task-count-icon">${projectTaskCount}</div></button>`;

  projectButtonsContainer.insertBefore(projectMoreOptionsDropdownIcon, projectButtonsContainer.firstElementChild);
  projectButtonsContainer.insertBefore(projectButton.firstElementChild, projectButtonsContainer.firstElementChild);
  
  projectButtonsContainer.firstElementChild.addEventListener('click', viewProjectTasks, false);
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

  //Restore add task button event listener to restore UI functionality of dynamically adding tasks
  document.getElementById('add-task-button').addEventListener('click', initAddTaskEvent, false);
}

function removeEditingExistingTaskForm() {
  //Clear all input fields
  document.getElementById('name-edit').value = "";
  document.getElementById('date-edit').value = "";
  document.getElementById('description-edit').value = "";

  //Both of these methods clear radio buttons using checked property
  //Convert nodelist into array to execute Array.map function
  [...document.getElementsByName('priority-edit')].map(element => element.checked = false);
  //Or use forEach function for nodelists that can iterate these types of objects
  document.getElementsByName('priority-edit').forEach(element => element.checked = false);

  //Clone node to get rid of event listeners
  var old_element = document.getElementById("update-task-button");
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);

  //Get rid of the Task display
  document.querySelector('.task-form-edit').style.display = 'none';

  //Restore edit task click event listener to restore UI functionality of dynamically editing tasks
  taskEditContainer.addEventListener('click', initEditTaskEvent, false);
}

function displayFooter() {
  const footer = document.querySelector('.footer-container');
  displayCopyrightMessageIcon(footer);
  displayCurrentYear(footer);
  displayGithubUsernameLink(footer);
  displayGithubLogo(footer);
}

function displayCopyrightMessageIcon(footer) {
  const copyrightMessageIcon = document.createElement('span');
  copyrightMessageIcon.textContent = 'Copyright \u00A9';
  footer.appendChild(copyrightMessageIcon);
}

function displayCurrentYear(footer) {
  const year = document.createElement('span');
  year.textContent = `${new Date().getFullYear()}`;
  footer.appendChild(year);
}

function displayGithubUsernameLink(footer) {
  const usernameLink = document.createElement('a');
  usernameLink.setAttribute('href', 'https://github.com/hosja83/todo-list');
  usernameLink.setAttribute('target', '_blank');
  usernameLink.textContent = 'hosja83';
  footer.appendChild(usernameLink);
}

function displayGithubLogo(footer) {
  const githubLink = document.createElement('a');
  DOMUtil.setAttributes(githubLink, {
    "href": "https://github.com/hosja83/todo-list",
    "target": "_blank",
  });
  const githubLogo = document.createElement('i');
  githubLogo.setAttribute('class', 'fa-brands fa-github');
  githubLogo.classList.add('github-logo');
  footer.appendChild(githubLink).appendChild(githubLogo);
}