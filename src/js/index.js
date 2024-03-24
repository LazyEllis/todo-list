import "../style.scss";
import "bootstrap";
import getFormData from "./form";
import {
  addProject,
  findProject,
  getProjects,
  deleteProject,
  editProject,
} from "./project";
import {
  renderProjectBtns,
  setDeleteProjectName,
  setEditProjectName,
  toggleCollapseIcon,
  renderAddTaskHoverEffect,
  renderProjectDetails,
  renderMyDayProjectDetails,
  renderNext7DaysProjectDetails,
  renderAllProjectDetails,
  renderProjectDropdown,
  setDeleteTaskName,
  setDeleteTaskProject,
} from "./ui";
import { addTask, findTask, deleteTask, editTask } from "./task";

const sidebar = document.querySelector("#sidebar");
const collapseBtn = document.querySelector(".collapse-btn");
const addProjectForm = document.querySelector("#add-project-form");
const projectNameInput = document.querySelector("#project-name");
const addProjectBtn = document.querySelector(".add-project-btn");
const deleteProjectBtn = document.querySelector(".delete-project-btn");
const editProjectForm = document.querySelector("#edit-project-form");
const editProjectNameInput = document.querySelector("#edit-project-name");
const editProjectBtn = document.querySelector(".edit-project-btn");
const projectTaskList = document.querySelector(".project-task-list");
const addTaskForm = document.querySelector("#add-task-form");
const taskNameInput = document.querySelector("#task-name");
const taskProjectDropdown = document.querySelector("#task-project");
const addTaskBtn = document.querySelector(".add-task-btn");
const deleteTaskBtn = document.querySelector(".delete-task-btn");
const editTaskForm = document.querySelector("#edit-task-form");
const editTaskNameInput = document.querySelector("#edit-task-name");
const editTaskProjectDropdown = document.querySelector("#edit-task-project");
const editTaskBtn = document.querySelector(".edit-task-btn");
const baseProjects = ["All My Tasks", "My Day", "Next 7 Days"];

const validateProjectName = (nameInput, submitBtn) => {
  if (findProject(nameInput.value.trim()) !== undefined) {
    nameInput.setCustomValidity("Project already exists");
  } else {
    nameInput.setCustomValidity("");
  }

  if (nameInput.checkValidity()) {
    submitBtn.setAttribute("data-bs-dismiss", "modal");
  } else {
    submitBtn.removeAttribute("data-bs-dismiss");
  }
};

const validateTaskName = (nameInput) => {
  const taskProject = document.querySelector("#task-project").value;

  if (
    findTask(findProject(taskProject), nameInput.value.trim()) !== undefined
  ) {
    nameInput.setCustomValidity("Task already exists");
  } else {
    nameInput.setCustomValidity("");
  }
};

const collapseForm = (form, submitBtn) => {
  if (form.checkValidity()) {
    submitBtn.setAttribute("data-bs-dismiss", "modal");
  } else {
    submitBtn.removeAttribute("data-bs-dismiss");
  }
};

const setAddTaskDetails = (button) => {
  const projectName = button.getAttribute("data-project");
  if (baseProjects.includes(projectName)) return;

  document.querySelector("#task-project").value = projectName;
};

const setEditTaskDetails = (button) => {
  const projectName = button.getAttribute("data-project");
  const taskName = button.getAttribute("data-task");
  const project = findProject(projectName);
  const task = findTask(project, taskName);

  document.querySelector("#edit-task-name").value = taskName;
  document.querySelector("#edit-task-description").value = task.description;
  document.querySelector("#edit-task-date").value = task.dueDate;
  document.querySelector("#edit-task-priority").value = task.priority;
  document.querySelector("#edit-task-project").value = projectName;

  editTaskNameInput.setAttribute("data-task", taskName);
  editTaskBtn.setAttribute("data-project", projectName);
};

collapseBtn.addEventListener("click", toggleCollapseIcon);

sidebar.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-project-option")) {
    setDeleteProjectName(e.target);
  } else if (e.target.classList.contains("edit-project-option")) {
    setEditProjectName(e.target);
  } else if (e.target.classList.contains("project-btn")) {
    const projectName = e.target.getAttribute("data-project");

    if (projectName === "All My Tasks") {
      renderAllProjectDetails(getProjects());
    } else if (projectName === "My Day") {
      renderMyDayProjectDetails(getProjects());
    } else if (projectName === "Next 7 Days") {
      renderNext7DaysProjectDetails(getProjects());
    } else {
      renderProjectDetails(findProject(projectName));
    }
  }
});

projectTaskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-task-option")) {
    renderProjectDropdown(getProjects(), taskProjectDropdown);
    setAddTaskDetails(e.target);
  } else if (e.target.classList.contains("delete-task-option")) {
    setDeleteTaskName(e.target);
    setDeleteTaskProject(e.target);
  } else if (e.target.classList.contains("edit-task-option")) {
    renderProjectDropdown(getProjects(), editTaskProjectDropdown);
    setEditTaskDetails(e.target);
  }
});

projectTaskList.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("add-task-option")) {
    renderAddTaskHoverEffect(e);
  }
});

projectTaskList.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("add-task-option")) {
    renderAddTaskHoverEffect(e);
  }
});

projectNameInput.addEventListener("input", () => {
  validateProjectName(projectNameInput, addProjectBtn);
});

addProjectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const project = getFormData(addProjectForm);
  addProject(project.name.trim());
  renderProjectBtns(getProjects());
  addProjectForm.reset();
  renderProjectDetails(findProject(project.name));
});

deleteProjectBtn.addEventListener("click", () => {
  const projectName = document.querySelector(
    ".delete-project-name"
  ).textContent;
  deleteProject(projectName);
  renderProjectBtns(getProjects());

  const projectTitle = document.querySelector(".project-title");
  if (projectTitle.textContent === projectName) {
    renderMyDayProjectDetails(getProjects());
  }
});

editProjectNameInput.addEventListener("input", () => {
  validateProjectName(editProjectNameInput, editProjectBtn);
});

editProjectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const projectName = editProjectNameInput.getAttribute("data-project");
  const newProject = getFormData(editProjectForm);
  editProject(projectName, newProject.name.trim());
  renderProjectBtns(getProjects());
  editProjectForm.reset();

  const projectTitle = document.querySelector(".project-title");
  if (projectTitle.textContent === projectName) {
    renderProjectDetails(findProject(newProject.name));
  }
});

taskNameInput.addEventListener("input", () => {
  validateTaskName(taskNameInput, addTaskBtn);
});

addTaskForm.addEventListener("input", () => {
  collapseForm(addTaskForm, addTaskBtn);
});

addTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = getFormData(addTaskForm);
  addTask(
    findProject(task.project),
    task.name.trim(),
    task.description.trim(),
    task.dueDate,
    task.priority
  );
  if (document.querySelector(".project-title").textContent === task.project) {
    renderProjectDetails(findProject(task.project));
  }
  addTaskForm.reset();
});

deleteTaskBtn.addEventListener("click", (e) => {
  const projectName = e.target.getAttribute("data-project");
  const taskName = document.querySelector(".delete-task-name").textContent;
  deleteTask(findProject(projectName), taskName);

  renderProjectDetails(findProject(projectName));
});

editTaskNameInput.addEventListener("input", () => {
  validateTaskName(editTaskNameInput);
});

editTaskForm.addEventListener("input", () => {
  collapseForm(editTaskForm, editTaskBtn);
});

editTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const projectName = editTaskBtn.getAttribute("data-project");
  const taskName = editTaskNameInput.getAttribute("data-task");
  const newTask = getFormData(editTaskForm);
  editTask(
    findProject(projectName),
    taskName,
    findProject(newTask.project),
    newTask.name.trim(),
    newTask.description.trim(),
    newTask.dueDate,
    newTask.priority
  );
  renderProjectDetails(findProject(projectName));
  editTaskForm.reset();
});

renderMyDayProjectDetails(getProjects());
