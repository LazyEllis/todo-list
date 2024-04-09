/**
 * Factory function to create a task object.
 * @param {string} name - The name of the task.
 * @param {string} description - The description of the task.
 * @param {string} dueDate - The due date of the task.
 * @param {string} priority - The priority of the task.
 * @returns {Object} - The created task object.
 */
const taskFactory = (name, description, dueDate, priority) => {
  return { name, description, dueDate, priority, status: "Incomplete" };
};

/**
 * Adds a new task to a project.
 * @param {Object} project - The project object to add the task to.
 * @param {string} name - The name of the task.
 * @param {string} description - The description of the task.
 * @param {string} dueDate - The due date of the task.
 * @param {string} priority - The priority of the task.
 */
export const addTask = (project, name, description, dueDate, priority) => {
  const task = taskFactory(name, description, dueDate, priority);
  project.tasks.push(task);
};

/**
 * Finds a task by its name within a project.
 * @param {Object} project - The project object to search within.
 * @param {string} name - The name of the task to find.
 * @returns {Object|null} - The found task object, or null if not found.
 */
export const findTask = (project, name) => {
  return project.tasks.find((task) => task.name === name);
};

/**
 * Deletes a task from a project by its name.
 * @param {Object} project - The project object to delete the task from.
 * @param {string} name - The name of the task to delete.
 */
export const deleteTask = (project, name) => {
  const taskIndex = project.tasks.findIndex((task) => task.name === name);
  if (taskIndex !== -1) {
    project.tasks.splice(taskIndex, 1);
  }
};

/**
 * Toggles the status of a task between 'Incomplete' and 'Complete'.
 * @param {Object} project - The project object containing the task.
 * @param {string} name - The name of the task to toggle status for.
 */
export const toggleTaskStatus = (project, name) => {
  const task = findTask(project, name);
  if (task) {
    task.status = task.status === "Incomplete" ? "Complete" : "Incomplete";
  }
};

/**
 * Edits a task within a project.
 * @param {Object} project - The project object containing the task.
 * @param {string} name - The current name of the task.
 * @param {Object} newProject - The new project object if the task is moved.
 * @param {string} newName - The new name for the task.
 * @param {string} newDescription - The new description for the task.
 * @param {string} newDueDate - The new due date for the task.
 * @param {string} newPriority - The new priority for the task.
 */
export const editTask = (
  project,
  name,
  newProject,
  newName,
  newDescription,
  newDueDate,
  newPriority
) => {
  const task = findTask(project, name);
  if (task) {
    if (newProject.name === project.name) {
      task.name = newName;
      task.description = newDescription;
      task.dueDate = newDueDate;
      task.priority = newPriority;
    } else {
      deleteTask(project, name);
      addTask(newProject, newName, newDescription, newDueDate, newPriority);
    }
  }
};
