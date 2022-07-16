/**
 * Activates event listener on add project button for firing off a series of logical events
 * that should follow clicking the add project button
 */
export function onAddProjectEventListener(handler) {
  document.getElementById("add-project-button").addEventListener('click', handler); //initAddProjectEvent
}

/**
 * Remove event Listener while creating new project form is active and displayed
 */
export function removeAddProjectEventListener(handler) {
  document.getElementById("add-project-button").removeEventListener('click', handler); //initAddProjectEvent
}

/**
 * Listens for clicks on add Task button for the appropriate Project currently being viewed.
 * Then fires off a series of logical consequences as a result of clicking the add task button.
 */
export function onAddTaskEventListener(handler) {
  document.getElementById('add-task-button').addEventListener('click', handler, false); //initAddTaskEvent
}

/**
 * Removes add task button event listener
 * @param {Function} handler callback function triggered on click event 
 */
export function removeAddTaskEventListener(handler) {
  document.getElementById('add-task-button').removeEventListener('click', handler, false); //iniAddTaskEvent
}

/**
 * Adds event listener for the create button that adds a project to the list of projects.
 */
export function addCreateProjectEventListener(handler) {
  document.getElementById('project-form').addEventListener('submit', handler); //addProject
} //localStorage interactive result potential

/**
 * Adds event listener for the cancel button that cancels the creating of a new project.
 */
export function addCancelCreatingNewProjectEventListener(handler) {
  document.getElementById("cancel-on-add-project").addEventListener('click', handler); //restoreAddProjectButtonDisplay
}

/**
 * Adds event listener that listens for clicks on the create new task button to add new tasks.
 */
export function addCreateNewTaskEventListener(handler) {
  document.getElementById('task-form').addEventListener('submit', handler, false); //addNewTask
} //localStorage interactive result potential

/**
 * Adds event listener that listens for clicks/submissions on update task button.
 */
export function addUpdateExistingTaskEventListener(handler) {
  document.getElementById('task-form-edit').addEventListener('submit', handler, false); //updateTask
} //localStorage interactive result potential

/**
 * Add event listener for canceling the creating of a new task.
 */
export function addCancelCreatingNewTaskEventListener(handler) {
  document.querySelector(".cancel-task").addEventListener('click', handler, false); //removeCreatingNewTaskForm
}

/**
 * Add event listener for canceling the editing of an existing task.
 */
export function addCancelEditingExistingTaskEventListener(handler) {
  document.querySelector('.cancel-task-edit').addEventListener('click', handler, false); //removeEditingExistingTaskForm
}

/**
 * Add event listener for handling clicks outside of project more options dropdown anywhere 
 * in the body which will cause the dropdown to dissappear or display: none.
 */
export function addDocumentClearProjectMoreOptionsDropdownEventListener(handler) {
  document.body.addEventListener('click', handler, false); //clearProjectMoreOptionsDropdownDisplay
}

/**
 * Removes event listener used for handling clicks outside of project more options dropdown.
 */
export function removeDocumentClearProjectMoreOptionsDropdownEventListener(handler) {
  document.body.removeEventListener('click', handler, false); //clearProjectMoreOptionsDropdownDisplay
}

/**
 * Add checkbox event listener that handles the event of a Task being completed.
 */
export function addTaskCheckboxEventListener(el, handler) {
  el.addEventListener('click', handler, false); //handleTaskCompletion
}

/**
 * Add task flag priority event listener that handles the event of a Task flag priority change
 */
export function addTaskFlagPriorityEventListener(el, handler) {
  el.addEventListener('click', handler, false); //handleTaskFlagPriority
}

/**
 * Add Task name/title event listener that displays more details
 */
export function addTaskDetailsDisplay(el, handler) {
  el.addEventListener('click', handler, false); //handleTaskDetailsDisplay
}

/**
 * Add task Edit event listener to allow user to edit the task
 */
export function addEditTaskEventListener(el, handler) {
  el.addEventListener('click', handler, false); //initEditTaskEvent
}

/**
 * Remove edit task event listener
 */
export function removeEditTaskEventListener(el, handler) {
  el.removeEventListener('click', handler, false); //initEditTaskEvent
}

/**
 * Add taskTrash event listener to handle deletion of Task
 */
export function addDeleteTaskEventListener(el, handler) {
  el.addEventListener('click', handler, false); //deleteTask
}

/**
 * Add event listener for displaying project more options dropdown
 */
export function addProjectMoreOptionsEventListener(el, handler) {
  el.addEventListener('click', handler, false); //displayProjectMoreOptions
}

/**
 * Add a click listener to display project's tasks when clicked
 */
export function addViewProjectTasksEventListener(el, handler) {
  el.addEventListener('click', handler, false); //viewProjectTasks
}

/**
 * Remove click listener that displays project's tasks
 */
export function removeViewProjectTasksEventListener(el, handler) {
  el.removeEventListener('click', handler, false); //viewProjectTasks
}

/**
 * Add cancel renaming project event listener
 */
export function addCancelRenamingProjectEventListener(el, handler) {
  el.addEventListener('click', handler, false); //cancelRenamingProjectHandler(event)
}

/**
 * Add rename project event listener
 */
export function addRenameProjectEventListener(el, handler) {
  el.addEventListener('click', handler, false); //renameProjectHandler(event)
}