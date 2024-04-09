import "../scss/style.scss";
import "./bootstrap";
import {
  addProject,
  findProject,
  getProjects,
  deleteProject,
  editProject,
} from "./project";
import {
  addTask,
  findTask,
  deleteTask,
  toggleTaskStatus,
  editTask,
} from "./task";
import {
  renderProjectBtns,
  setDeleteProjectName,
  setEditProjectName,
  toggleCollapseIcon,
  renderAddTaskHoverEffect,
  renderTaskPriorityHoverEffect,
  renderProjectDetails,
  renderMyDayProjectDetails,
  renderNext7DaysProjectDetails,
  renderAllProjectDetails,
  renderProjectDropdown,
  setDeleteTaskName,
  setDeleteTaskProject,
} from "./ui";
import getFormData from "./form";
import saveProjects from "./local-storage";

const sidebar = document.querySelector("#sidebar");
const collapseBtn = document.querySelector(".collapse-btn");
const baseProjects = ["All My Tasks", "My Day", "Next 7 Days"];

const select = (selector) => document.querySelector(selector);

/**
 * DOM elements used in the task manager module.
 * @constant {object}
 */
const elements = {
  addProjectForm: select("#add-project-form"),
  addProjectBtn: select(".add-project-btn"),
  deleteProjectBtn: select(".delete-project-btn"),
  editProjectForm: select("#edit-project-form"),
  editProjectBtn: select(".edit-project-btn"),
  projectNameInput: select("#project-name"),
  editProjectNameInput: select("#edit-project-name"),
  projectTaskList: select(".project-task-list"),
  addTaskForm: select("#add-task-form"),
  taskNameInput: select("#task-name"),
  taskProjectDropdown: select("#task-project"),
  addTaskBtn: select(".add-task-btn"),
  deleteTaskBtn: select(".delete-task-btn"),
  editTaskForm: select("#edit-task-form"),
  editTaskNameInput: select("#edit-task-name"),
  editTaskDescription: select("#edit-task-description"),
  editTaskDate: select("#edit-task-date"),
  editTaskPriority: select("#edit-task-priority"),
  editTaskProjectDropdown: select("#edit-task-project"),
  editTaskBtn: select(".edit-task-btn"),
};

/**
 * Validates the project name input field.
 * @param {HTMLInputElement} nameInput - The input field for project name.
 * @param {HTMLButtonElement} submitBtn - The submit button for the form.
 */
const validateProjectName = (nameInput, submitBtn) => {
  const projectExists = findProject(nameInput.value.trim()) !== undefined;
  nameInput.setCustomValidity(projectExists ? "Project already exists" : "");

  submitBtn.setAttribute(
    "data-bs-dismiss",
    nameInput.checkValidity() ? "modal" : null
  );
};

/**
 * Validates the task name input field.
 * @param {HTMLInputElement} nameInput - The input field for task name.
 * @param {HTMLSelectElement} projectDropdown - The select field for project name.
 */
const validateTaskName = (nameInput, projectDropdown) => {
  const projectNotFound = findProject(projectDropdown.value) === undefined;
  const taskExists =
    findTask(findProject(projectDropdown.value), nameInput.value.trim()) !==
    undefined;

  if (projectNotFound) {
    nameInput.setCustomValidity("You must create a project first");
  } else if (taskExists) {
    nameInput.setCustomValidity("Task already exists");
  } else {
    nameInput.setCustomValidity("");
  }
};

/**
 * Collapses the form if it's valid.
 * @param {HTMLFormElement} form - The form element to check validity.
 * @param {HTMLButtonElement} submitBtn - The submit button for the form.
 */
const collapseForm = (form, submitBtn) => {
  submitBtn.setAttribute(
    "data-bs-dismiss",
    form.checkValidity() ? "modal" : null
  );
};

/**
 * Sets the details for adding a new task based on the selected project.
 * @param {HTMLElement} button - The button triggering the action.
 */
const setAddTaskDetails = (button) => {
  const projectName = button.getAttribute("data-project");
  if (baseProjects.includes(projectName)) return;

  elements.taskProjectDropdown.value = projectName;
};

/**
 * Sets the details for editing a task based on the selected project and task.
 * @param {HTMLElement} button - The button triggering the action.
 */
const setEditTaskDetails = (button) => {
  const projectName = button.getAttribute("data-project");
  const taskName = button.getAttribute("data-task");
  const project = findProject(projectName);
  const task = findTask(project, taskName);

  elements.editTaskNameInput.value = taskName;
  elements.editTaskDescription.value = task.description;
  elements.editTaskDate.value = task.dueDate;
  elements.editTaskPriority.value = task.priority;
  elements.editTaskProjectDropdown.value = projectName;

  elements.editTaskNameInput.setAttribute("data-task", taskName);
  elements.editTaskBtn.setAttribute("data-project", projectName);
};

/**
 * Renders the appropriate project details based on the selected project name.
 * @param {string} projectName - The name of the project.
 */
const renderProject = (projectName) => {
  switch (projectName) {
    case "All My Tasks":
      renderAllProjectDetails(getProjects());
      break;
    case "My Day":
      renderMyDayProjectDetails(getProjects());
      break;
    case "Next 7 Days":
      renderNext7DaysProjectDetails(getProjects());
      break;
    default:
      renderProjectDetails(findProject(projectName));
  }
};

const renderCurrentProject = () => {
  const projectTitle = select(".project-title");
  renderProject(projectTitle.textContent);
};

collapseBtn.addEventListener("click", toggleCollapseIcon);

sidebar.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-project-option")) {
    setDeleteProjectName(e.target);
  } else if (e.target.classList.contains("edit-project-option")) {
    setEditProjectName(e.target);
  } else if (e.target.classList.contains("project-btn")) {
    renderProject(e.target.getAttribute("data-project"));
  }
});

elements.projectTaskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-task-option")) {
    renderProjectDropdown(getProjects(), elements.taskProjectDropdown);
    setAddTaskDetails(e.target);
  } else if (e.target.classList.contains("delete-task-option")) {
    setDeleteTaskName(e.target);
    setDeleteTaskProject(e.target);
  } else if (e.target.classList.contains("edit-task-option")) {
    renderProjectDropdown(getProjects(), elements.editTaskProjectDropdown);
    setEditTaskDetails(e.target);
  }
});

["mouseout", "mouseover"].forEach((event) => {
  elements.projectTaskList.addEventListener(event, (e) => {
    if (e.target.classList.contains("add-task-option")) {
      renderAddTaskHoverEffect(e);
    } else if (e.target.classList.contains("task-priority-icon")) {
      renderTaskPriorityHoverEffect(e);
    }
  });
});

elements.projectTaskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("task-priority-icon")) {
    const projectName = e.target.getAttribute("data-project");
    const taskName = e.target.getAttribute("data-task");

    toggleTaskStatus(findProject(projectName), taskName);
    saveProjects(getProjects());
    renderCurrentProject();
  }
});

elements.projectNameInput.addEventListener("input", () => {
  validateProjectName(elements.projectNameInput, elements.addProjectBtn);
});

elements.addProjectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const project = getFormData(elements.addProjectForm);
  addProject(project.name.trim());
  saveProjects(getProjects());
  renderProjectBtns(getProjects());
  elements.addProjectForm.reset();
  renderProject(project.name);
});

elements.deleteProjectBtn.addEventListener("click", () => {
  const projectName = select(".delete-project-name").textContent;
  deleteProject(projectName);
  saveProjects(getProjects());
  renderProjectBtns(getProjects());

  const projectTitle = select(".project-title");
  if (projectTitle.textContent === projectName) {
    renderProject("My Day");
  } else {
    renderCurrentProject();
  }
});

elements.editProjectNameInput.addEventListener("input", () => {
  validateProjectName(elements.editProjectNameInput, elements.editProjectBtn);
});

elements.editProjectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const projectName =
    elements.editProjectNameInput.getAttribute("data-project");
  const newProject = getFormData(elements.editProjectForm);
  editProject(projectName, newProject.name.trim());
  saveProjects(getProjects());
  renderProjectBtns(getProjects());
  elements.editProjectForm.reset();
  renderCurrentProject();
});

elements.taskNameInput.addEventListener("input", () => {
  validateTaskName(elements.taskNameInput, elements.taskProjectDropdown);
});

elements.addTaskForm.addEventListener("input", () => {
  collapseForm(elements.addTaskForm, elements.addTaskBtn);
});

elements.addTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = getFormData(elements.addTaskForm);
  addTask(
    findProject(task.project),
    task.name.trim(),
    task.description.trim(),
    task.dueDate,
    task.priority
  );
  saveProjects(getProjects());
  renderCurrentProject();
  elements.addTaskForm.reset();
});

elements.deleteTaskBtn.addEventListener("click", (e) => {
  const projectName = e.target.getAttribute("data-project");
  const taskName = select(".delete-task-name").textContent;
  deleteTask(findProject(projectName), taskName);
  saveProjects(getProjects());
  renderCurrentProject();
});

elements.editTaskNameInput.addEventListener("input", () => {
  validateTaskName(
    elements.editTaskNameInput,
    elements.editTaskProjectDropdown
  );
});

elements.editTaskForm.addEventListener("input", () => {
  collapseForm(elements.editTaskForm, elements.editTaskBtn);
});

elements.editTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const projectName = elements.editTaskBtn.getAttribute("data-project");
  const taskName = elements.editTaskNameInput.getAttribute("data-task");
  const newTask = getFormData(elements.editTaskForm);
  editTask(
    findProject(projectName),
    taskName,
    findProject(newTask.project),
    newTask.name.trim(),
    newTask.description.trim(),
    newTask.dueDate,
    newTask.priority
  );
  saveProjects(getProjects());
  renderCurrentProject();
  elements.editTaskForm.reset();
});

renderProject("My Day");
renderProjectBtns(getProjects());
