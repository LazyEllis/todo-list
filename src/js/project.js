/**
 * Represents a project, which contains a list of tasks.
 */
export default class Project {
  /**
   * Creates an instance of Project.
   * @param {string} name - The name of the project.
   */
  constructor(name) {
    this.name = name;
    this.tasks = [];
  }

  /**
   * Adds a task to the project.
   * @param {Task} task - The task to add.
   */
  addTask(task) {
    this.tasks.push(task);
  }

  /**
   * Finds a task by name.
   * @param {string} taskName - The name of the task to find.
   * @returns {Task|undefined} The task with the given name, or undefined if not found.
   */
  findTask(taskName) {
    return this.tasks.find((task) => task.name === taskName);
  }

  /**
   * Deletes a task by name.
   * @param {string} taskName - The name of the task to delete.
   */
  deleteTask(taskName) {
    this.tasks = this.tasks.filter((task) => task.name !== taskName);
  }

  /**
   * Edits the project name.
   * @param {string} newName - The new name of the project.
   */
  edit(newName) {
    this.name = newName;
  }
}
