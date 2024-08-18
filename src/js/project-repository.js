import Project from "./project";
import Task from "./task";

/**
 * Repository for managing projects in local storage.
 */
export default class ProjectRepository {
  /**
   * Creates an instance of ProjectRepository.
   * @param {string} [storageKey="projects"] - The key used to store projects in localStorage.
   */
  constructor(storageKey = "projects") {
    this.storageKey = storageKey;
    this.projects = this.loadProjects();
  }

  /**
   * Loads projects from localStorage.
   * @returns {Project[]} An array of Project instances.
   */
  loadProjects() {
    const projects = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    return projects.map((projectData) => {
      const project = new Project(projectData.name);
      project.tasks = projectData.tasks.map(
        (taskData) =>
          new Task(
            taskData.name,
            taskData.description,
            taskData.dueDate,
            taskData.priority
          )
      );
      return project;
    });
  }

  /**
   * Saves the current projects to localStorage.
   */
  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.projects));
  }

  /**
   * Gets all projects.
   * @returns {Project[]} An array of Project instances.
   */
  getAll() {
    return this.projects;
  }

  /**
   * Adds a new project and saves it to localStorage.
   * @param {Project} project - The project to add.
   */
  add(project) {
    this.projects.push(project);
    this.save();
  }

  /**
   * Finds a project by name.
   * @param {string} name - The name of the project to find.
   * @returns {Project|undefined} The project with the given name, or undefined if not found.
   */
  find(name) {
    return this.projects.find((project) => project.name === name.trim());
  }

  /**
   * Deletes a project by name and saves the changes to localStorage.
   * @param {string} name - The name of the project to delete.
   */
  delete(name) {
    this.projects = this.projects.filter(
      (project) => project.name !== name.trim()
    );
    this.save();
  }
}
