/**
 * Represents a task within a project.
 */
export default class Task {
  /**
   * Creates an instance of Task.
   * @param {string} name - The name of the task.
   * @param {string} description - The description of the task.
   * @param {Date} dueDate - The due date of the task.
   * @param {string} priority - The priority of the task.
   */
  constructor(name, description, dueDate, priority) {
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = "Incomplete";
  }

  /**
   * Toggles the status of the task between "Incomplete" and "Complete".
   */
  toggleStatus() {
    this.status = this.status === "Incomplete" ? "Complete" : "Incomplete";
  }

  /**
   * Edits the task details.
   * @param {string} name - The new name of the task.
   * @param {string} description - The new description of the task.
   * @param {Date} dueDate - The new due date of the task.
   * @param {string} priority - The new priority of the task.
   */
  edit(name, description, dueDate, priority) {
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }
}
