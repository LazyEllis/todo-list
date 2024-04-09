/**
 * Saves projects data to local storage.
 * @param {Array} projects - The projects array to save.
 */
const saveProjects = (projects) => {
  localStorage.setItem("projects", JSON.stringify(projects));
};

export default saveProjects;
