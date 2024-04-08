const projects = JSON.parse(localStorage.getItem("projects")) || [];

export const projectFactory = (name) => {
  const tasks = [];
  return { name, tasks };
};

export const getProjects = () => projects;

export const findProject = (name) => {
  return projects.find((project) => project.name === name.trim());
};

export const addProject = (name) => {
  const project = projectFactory(name);
  projects.push(project);
};

export const deleteProject = (name) => {
  const project = findProject(name);
  projects.splice(projects.indexOf(project), 1);
};

export const editProject = (name, newName) => {
  const project = findProject(name);
  project.name = newName;
};
