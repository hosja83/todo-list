import * as UIEventList from '../view/event-listeners';
//..reference like Main.addProject or Index.addProject
import { addProject, addNewTask, deleteTask, todoListProjects, taskEditContainer, displayProjectMoreOptions,
         projectNameWhereMoreOptionsDropdownDisplayed, initEditTaskEvent,
         isProjectMoreOptionsDropdownDisplayed } from '../index'; 
import * as DOMUtil from '../util/dom-util';

/**
 * Adds the initial UI event Listeners needed for the add project and add task events.
 */
export function initUIAddListeners() {
  UIEventList.onAddProjectEventListener(initAddProjectEvent);
  UIEventList.onAddTaskEventListener(initAddTaskEvent);
}

export function initAddProjectEvent() {
  // Add Project button disappears temporarily, Input text field appears
  document.getElementById("on-add-project").style.display = "block";

  // Remove event Listener while creating new project form is active and displayed
  UIEventList.removeAddProjectEventListener(initAddProjectEvent);
  
  //..Insert a way to make the input field focus or show cursor for typing text in after click
  //..add project event gets initiated

  UIEventList.addCancelCreatingNewProjectEventListener(restoreAddProjectButtonDisplay);
  UIEventList.addCreateProjectEventListener(addProject);
}

/**
 * Handles an event where user clicks on the cancel button when creating a new project by
 * restoring the previous display of add project button without the text input form.
 */
export function restoreAddProjectButtonDisplay() {
  // Hides and input and create/cancel display takes no space
  document.getElementById("create-project").value = "";
  document.getElementById("on-add-project").style.display = "none";

  // No need to redo creation of add-project button, just restore add project event listener
  UIEventList.onAddProjectEventListener(initAddProjectEvent);
}

export function initAddTaskEvent() {
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
  UIEventList.removeAddTaskEventListener(initAddTaskEvent);

  // user may click exit X button
  UIEventList.addCancelCreatingNewTaskEventListener(removeCreatingNewTaskForm);

  // user may click create new task button
  UIEventList.addCreateNewTaskEventListener(addNewTask);
}

export function removeCreatingNewTaskForm() {
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
  UIEventList.onAddTaskEventListener(initAddTaskEvent);
}

export function removeEditingExistingTaskForm() {
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
  UIEventList.addEditTaskEventListener(taskEditContainer, initEditTaskEvent);
}

export function appendProjectToList(projectName) {
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
  UIEventList.addProjectMoreOptionsEventListener(projectMoreOptionsButton, displayProjectMoreOptions);

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

  document.getElementById("project-list").appendChild(pListElement);

  //When a new Project is created, add a click listener to display tasks when clicked
  UIEventList.addViewProjectTasksEventListener(pButton, viewProjectTasks);
}

/**
 * Display and append the Task with the given informaiton to the list of Tasks in the todo-list
 * content section.
 * 
 * @param {String} title title or name of the Task to display
 * @param {String} date date of the Task to display in "yyyy-mm-dd" format
 * @param {String} priority priority of Task to display; 'Normal', 'High', or 'Low'
 */
export function displayTask(title, date, priority) {
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
  //..
  UIEventList.addTaskCheckboxEventListener(taskCheckbox, handleTaskCompletion);

  const taskTitle = document.createElement('div');
  taskTitle.classList.add('task-title');
  taskTitle.textContent = title.trim();

  //Add Task name/title event listener that displays more details
  UIEventList.addTaskDetailsDisplay(taskTitle, handleTaskDetailsDisplay);

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
  //..
  UIEventList.addTaskFlagPriorityEventListener(taskFlagPriority, handleTaskFlagPriority);

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
  UIEventList.addEditTaskEventListener(taskEdit, initEditTaskEvent);

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
  UIEventList.addDeleteTaskEventListener(taskTrash, deleteTask);

  //Append Task list item and Task container content to the Task list
  taskList.appendChild(taskListItem).appendChild(taskContainer);
  DOMUtil.appendChildren(taskContainer, [taskCheckbox, taskTitle, taskDate, taskFlagPriority, taskEdit, taskTrash]);
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

function handleTaskCompletion() {
  //Check if Task a line through or not, if line-through style is applied then undo line-thru and checkmark
  //If no line-through is found then, apply line-through style and put checkmar in box
}

function handleTaskFlagPriority() {
  // Init by displaying labeled Flag priority options dropdown
  // add click event listeners for each dropdown selection 
  // handle if user changes priority
  // this feature does not need to be added however adds more interactive options for user to change
  // task priority other than through the task form
}

export function viewProjectTasks(event) {
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
  if (document.getElementById('task-list').hasChildNodes)
    DOMUtil.removeAllChildNodes(document.getElementById('task-list'));

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

export function restoreProjectButtonDisplay(event, projectName, projectTaskCount, projectButton, projectMoreOptionsDropdownIcon) {
  event.path[4].style.height = '49px'; // change project list item height back to original style

  //Restore given projectButton & projectMoreOptionsDropdown
  const projectButtonsContainer = event.path[3];
  projectButtonsContainer.removeChild(projectButtonsContainer.firstElementChild);

  projectButton.innerHTML = `<button class="project-button" id="${projectName}"><div class="project-icon"><svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="52px" height="45px" viewBox="0 0 338.000000 323.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,323.000000) scale(0.050000,-0.050000)" fill="#437798" stroke="#437798"><path d="M2312 4281 l-182 -178 -75 68 c-92 85 -114 86 -193 5 -85 -87 -82 -98 77 -257 192 -192 195 -191 461 76 273 273 299 319 228 404 -78 93 -114 80 -316 -118z"></path><path d="M2895 4258 c-37 -21 -44 -91 -22 -223 l12 -74 848 -6 847 -5 0 165 0 165 -825 -1 c-523 0 -838 -8 -860 -21z"></path><path d="M2416 3515 c-37 -36 -114 -118 -173 -183 l-105 -118 -89 87 -89 87 -80 -78 c-104 -102 -104 -101 64 -267 190 -187 181 -189 463 99 276 284 289 306 217 383 -68 72 -126 69 -208 -10z"></path><path d="M2889 3366 c-29 -29 -30 -252 -1 -280 10 -11 1692 -7 1692 3 0 6 0 79 0 161 l0 150 -829 0 c-749 0 -831 -3 -862 -34z"></path><path d="M2099 2620 c-134 -37 -199 -119 -199 -251 0 -297 408 -358 501 -76 55 168 -134 373 -302 327z"></path><path d="M3220 2520 c-170 -5 -322 -18 -338 -28 -24 -16 -21 -259 4 -284 3 -4 388 -8 855 -8 l849 -2 7 166 6 166 -536 0 c-296 0 -676 -4 -847 -10z"></path></g></svg></div>${projectName}<div class="project-task-count-icon">${projectTaskCount}</div></button>`;

  projectButtonsContainer.insertBefore(projectMoreOptionsDropdownIcon, projectButtonsContainer.firstElementChild);
  projectButtonsContainer.insertBefore(projectButton.firstElementChild, projectButtonsContainer.firstElementChild);
  
  UIEventList.addViewProjectTasksEventListener(projectButtonsContainer.firstElementChild, viewProjectTasks);
}

export function cancelRenamingProjectHandler(event, projectName, projectTaskCount, projectButton, projectMoreOptionsDropdownIcon) {
  restoreProjectButtonDisplay(event, projectName, projectTaskCount, projectButton, projectMoreOptionsDropdownIcon);
}

export function clearProjectMoreOptionsDropdownDisplay(event) {
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

export function clearDuplicateProjectMoreOptionsDropdownDisplay() {
  const projectButton = document.getElementById(projectNameWhereMoreOptionsDropdownDisplayed);
  projectButton.parentElement.lastElementChild.style.display = 'none';
}