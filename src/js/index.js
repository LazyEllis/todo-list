import "../scss/style.scss";
import "./bootstrap";
import ProjectRepository from "./project-repository";
import Project from "./project";
import Task from "./task";
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

// Initialize the project repository
const projectRepo = new ProjectRepository();

// Base projects to be displayed by default
const baseProjects = ["All My Tasks", "My Day", "Next 7 Days"];

/**
 * Utility function to select a DOM element.
 * @param {string} selector - The CSS selector for the element.
 * @returns {Element} The selected DOM element.
 */
const select = (selector) => document.querySelector(selector);

// Object holding references to important DOM elements
const elements = {
  sidebar: select("#sidebar"),
  collapseBtn: select(".collapse-btn"),
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
 * Validates if a project name already exists.
 * Updates the custom validity message and the submit button's dismiss attribute.
 * @param {HTMLInputElement} nameInput - The input element for the project name.
 * @param {HTMLButtonElement} submitBtn - The submit button element.
 */
const validateProjectName = (nameInput, submitBtn) => {
  const projectExists = projectRepo.find(nameInput.value.trim()) !== undefined;
  nameInput.setCustomValidity(projectExists ? "Project already exists" : "");
  submitBtn.setAttribute(
    "data-bs-dismiss",
    nameInput.checkValidity() ? "modal" : null
  );
};

/**
 * Validates if a task name already exists within a project.
 * Updates the custom validity message for the task name input.
 * @param {HTMLInputElement} nameInput - The input element for the task name.
 * @param {HTMLSelectElement} projectDropdown - The dropdown element for selecting a project.
 */
const validateTaskName = (nameInput, projectDropdown) => {
  const project = projectRepo.find(projectDropdown.value);
  const taskExists = project?.findTask(nameInput.value.trim()) !== undefined;

  if (!project) {
    nameInput.setCustomValidity("You must create a project first");
  } else if (taskExists) {
    nameInput.setCustomValidity("Task already exists");
  } else {
    nameInput.setCustomValidity("");
  }
};

/**
 * Collapses the form if it is valid.
 * @param {HTMLFormElement} form - The form element to be validated and collapsed.
 * @param {HTMLButtonElement} submitBtn - The submit button element.
 */
const collapseForm = (form, submitBtn) => {
  submitBtn.setAttribute(
    "data-bs-dismiss",
    form.checkValidity() ? "modal" : null
  );
};

/**
 * Sets the default project for adding a new task.
 * Prevents assignment to base projects.
 * @param {HTMLElement} button - The button element triggering the task addition.
 */
const setAddTaskDetails = (button) => {
  const projectName = button.getAttribute("data-project");
  if (baseProjects.includes(projectName)) return;
  elements.taskProjectDropdown.value = projectName;
};

/**
 * Sets the details in the form for editing an existing task.
 * @param {HTMLElement} button - The button element triggering the task edit.
 */
const setEditTaskDetails = (button) => {
  const projectName = button.getAttribute("data-project");
  const taskName = button.getAttribute("data-task");
  const project = projectRepo.find(projectName);
  const task = project?.findTask(taskName);

  elements.editTaskNameInput.value = task.name;
  elements.editTaskDescription.value = task.description;
  elements.editTaskDate.value = task.dueDate;
  elements.editTaskPriority.value = task.priority;
  elements.editTaskProjectDropdown.value = projectName;
  elements.editTaskNameInput.setAttribute("data-task", taskName);
  elements.editTaskBtn.setAttribute("data-project", projectName);
};

/**
 * Renders the selected project details based on the project name.
 * @param {string} projectName - The name of the project to be rendered.
 */
const renderProject = (projectName) => {
  switch (projectName) {
    case "All My Tasks":
      renderAllProjectDetails(projectRepo.getAll());
      break;
    case "My Day":
      renderMyDayProjectDetails(projectRepo.getAll());
      break;
    case "Next 7 Days":
      renderNext7DaysProjectDetails(projectRepo.getAll());
      break;
    default:
      renderProjectDetails(projectRepo.find(projectName));
  }
};

/**
 * Renders the details of the current project based on the selected title.
 */
const renderCurrentProject = () => {
  const projectTitle = select(".project-title");
  renderProject(projectTitle.textContent);
};

// Event listeners for various UI interactions

// Toggles the collapse button icon
elements.collapseBtn.addEventListener("click", toggleCollapseIcon);

// Handles sidebar project actions like delete, edit, and view
elements.sidebar.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-project-option")) {
    setDeleteProjectName(e.target);
  } else if (e.target.classList.contains("edit-project-option")) {
    setEditProjectName(e.target);
  } else if (e.target.classList.contains("project-btn")) {
    renderProject(e.target.getAttribute("data-project"));
  }
});

// Handles project task list interactions
elements.projectTaskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-task-option")) {
    renderProjectDropdown(projectRepo.getAll(), elements.taskProjectDropdown);
    setAddTaskDetails(e.target);
  } else if (e.target.classList.contains("delete-task-option")) {
    setDeleteTaskName(e.target);
    setDeleteTaskProject(e.target);
  } else if (e.target.classList.contains("edit-task-option")) {
    renderProjectDropdown(
      projectRepo.getAll(),
      elements.editTaskProjectDropdown
    );
    setEditTaskDetails(e.target);
  }
});

// Handles hover effects for task actions
["mouseout", "mouseover"].forEach((event) => {
  elements.projectTaskList.addEventListener(event, (e) => {
    if (e.target.classList.contains("add-task-option")) {
      renderAddTaskHoverEffect(e);
    } else if (e.target.classList.contains("task-priority-icon")) {
      renderTaskPriorityHoverEffect(e);
    }
  });
});

// Toggles task completion status
elements.projectTaskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("task-priority-icon")) {
    const projectName = e.target.getAttribute("data-project");
    const taskName = e.target.getAttribute("data-task");

    const project = projectRepo.find(projectName);
    const task = project?.findTask(taskName);
    task?.toggleStatus();

    projectRepo.save();
    renderCurrentProject();
  }
});

// Project name validation during input
elements.projectNameInput.addEventListener("input", () => {
  validateProjectName(elements.projectNameInput, elements.addProjectBtn);
});

// Handles project creation
elements.addProjectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const projectData = getFormData(elements.addProjectForm);
  const project = new Project(projectData.name.trim());
  projectRepo.add(project);

  renderProjectBtns(projectRepo.getAll());
  elements.addProjectForm.reset();
  renderProject(project.name);
});

// Handles project deletion
elements.deleteProjectBtn.addEventListener("click", () => {
  const projectName = select(".delete-project-name").textContent;
  projectRepo.delete(projectName);

  renderProjectBtns(projectRepo.getAll());
  const projectTitle = select(".project-title");
  if (projectTitle.textContent === projectName) {
    renderProject("My Day");
  } else {
    renderCurrentProject();
  }
});

// Project name validation during editing
elements.editProjectNameInput.addEventListener("input", () => {
  validateProjectName(elements.editProjectNameInput, elements.editProjectBtn);
});

// Handles project editing
elements.editProjectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const originalName =
    elements.editProjectNameInput.getAttribute("data-project");
  const newProjectData = getFormData(elements.editProjectForm);

  const project = projectRepo.find(originalName);
  project?.edit(newProjectData.name);
  projectRepo.save();

  renderProjectBtns(projectRepo.getAll());
  elements.editProjectForm.reset();
  renderProject(newProjectData.name);
});

// Task name validation during input
elements.taskNameInput.addEventListener("input", () => {
  validateTaskName(elements.taskNameInput, elements.taskProjectDropdown);
});

// Collapse the task form if valid
elements.addTaskForm.addEventListener("input", () => {
  collapseForm(elements.addTaskForm, elements.addTaskBtn);
});

// Handles task creation
elements.addTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskData = getFormData(elements.addTaskForm);
  const project = projectRepo.find(taskData.project);
  const task = new Task(
    taskData.name.trim(),
    taskData.description.trim(),
    taskData.dueDate,
    taskData.priority
  );

  project?.addTask(task);
  projectRepo.save();

  renderCurrentProject();
  elements.addTaskForm.reset();
});

// Handles task deletion
elements.deleteTaskBtn.addEventListener("click", (e) => {
  const projectName = e.target.getAttribute("data-project");
  const taskName = select(".delete-task-name").textContent;

  const project = projectRepo.find(projectName);
  project?.deleteTask(taskName);

  projectRepo.save();
  renderCurrentProject();
});

// Task name validation during editing
elements.editTaskNameInput.addEventListener("input", () => {
  validateTaskName(
    elements.editTaskNameInput,
    elements.editTaskProjectDropdown
  );
});

// Collapse the edit task form if valid
elements.editTaskForm.addEventListener("input", () => {
  collapseForm(elements.editTaskForm, elements.editTaskBtn);
});

// Handles task editing
elements.editTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const projectName = elements.editTaskBtn.getAttribute("data-project");
  const originalTaskName = elements.editTaskNameInput.getAttribute("data-task");
  const taskData = getFormData(elements.editTaskForm);

  const project = projectRepo.find(projectName);
  const task = project?.findTask(originalTaskName);

  task.edit(
    taskData.name.trim(),
    taskData.description.trim(),
    taskData.dueDate,
    taskData.priority
  );

  // If the task has moved to a new project, update the task location
  if (projectName !== taskData.project) {
    project?.deleteTask(originalTaskName);
    const newProject = projectRepo.find(taskData.project);
    newProject?.addTask(task);
  }

  projectRepo.save();
  renderCurrentProject();
});

// Initial render for the default "My Day" project and project buttons
renderProject("My Day");
renderProjectBtns(projectRepo.getAll());
