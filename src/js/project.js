/**
 * Factory function to create a project object.
 * @param {string} name - The name of the project.
 * @returns {Object} - The created project object.
 */
export const projectFactory = (name) => {
  const tasks = [];
  return { name, tasks };
};

// Retrieve projects from local storage or initialize an empty array
const projects = JSON.parse(localStorage.getItem("projects")) || [];

/**
 * Gets all projects.
 * @returns {Array} - Array containing all projects.
 */
export const getProjects = () => projects;

export const saveProjects = () => {
  localStorage.setItem("projects", JSON.stringify(projects));
};

/**
 * Finds a project by its name.
 * @param {string} name - The name of the project to find.
 * @returns {Object|null} - The found project object, or null if not found.
 */
export const findProject = (name) => {
  return projects.find((project) => project.name === name.trim());
};

/**
 * Adds a new project.
 * @param {string} name - The name of the project to add.
 */
export const addProject = (name) => {
  const project = projectFactory(name);
  projects.push(project);
  saveProjects();
};

/**
 * Deletes a project by its name.
 * @param {string} name - The name of the project to delete.
 */
export const deleteProject = (name) => {
  const project = findProject(name);
  projects.splice(projects.indexOf(project), 1);
  saveProjects();
};

/**
 * Edits the name of a project.
 * @param {string} name - The current name of the project.
 * @param {string} newName - The new name for the project.
 */
export const editProject = (name, newName) => {
  const project = findProject(name);
  if (project) {
    project.name = newName;
  }
  saveProjects();
};
