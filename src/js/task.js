const taskFactory = (name, description, dueDate, priority) => {
  return { name, description, dueDate, priority };
};

export const addTask = (project, name, description, dueDate, priority) => {
  const task = taskFactory(name, description, dueDate, priority);
  project.tasks.push(task);
};

export const findTask = (project, name) => {
  return project.tasks.find((task) => task.name === name);
};

export const deleteTask = (project, name) => {
  const task = findTask(project, name);
  project.tasks.splice(project.tasks.indexOf(task), 1);
};

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

  if (newProject.name === project.name) {
    task.name = newName;
    task.description = newDescription;
    task.dueDate = newDueDate;
    task.priority = newPriority;
  } else {
    deleteTask(project, name);
    addTask(newProject, newName, newDescription, newDueDate, newPriority);
  }
};
