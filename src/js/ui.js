import {
  format,
  addDays,
  isBefore,
  startOfDay,
  endOfDay,
  isToday,
  isTomorrow,
  isAfter,
  endOfYear,
} from "date-fns";

const projectList = document.querySelector("#project-list");
const deleteProjectName = document.querySelector(".delete-project-name");
const editProjectNameInput = document.querySelector("#edit-project-name");
const projectHeader = document.querySelector(".project-header");
const projectTaskList = document.querySelector(".project-task-list");
const deleteTaskName = document.querySelector(".delete-task-name");
const deleteTaskBtn = document.querySelector(".delete-task-btn");
const dropdownItems = ["Edit", "Delete"];

/**
 * Clears all child elements from a given DOM element.
 * @param {HTMLElement} element - The parent element to clear.
 */
const clearElement = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

/**
 * Replaces the CSS classes of an icon element.
 * @param {HTMLElement} icon - The icon element to modify.
 * @param {string} oldClass - The class to remove.
 * @param {string} newClass - The class to add.
 */
const replaceIcon = (icon, oldClass, newClass) => {
  icon.classList.remove(oldClass);
  icon.classList.add(newClass);
};

const clearProjectDetails = () => {
  clearElement(projectHeader);
  clearElement(projectTaskList);
};

/**
 * Renders the dropdown buttons for a project or task.
 * @param {string} item - The dropdown item text.
 * @param {string} projectName - The name of the project.
 * @param {string} [taskName=""] - The name of the task (optional).
 * @returns {HTMLButtonElement} - The rendered dropdown button element.
 */
const renderDropdownButtons = (item, projectName, taskName = "") => {
  const dropdownButton = document.createElement("button");
  const icon = document.createElement("i");
  const dropdownButtonClasses = ["dropdown-item"];

  dropdownButton.classList.add(...dropdownButtonClasses);
  dropdownButton.setAttribute("data-project", projectName);
  dropdownButton.textContent = item;

  if (taskName !== "") {
    dropdownButton.setAttribute("data-task", taskName);
  }

  if (item === "Edit") {
    dropdownButton.classList.add(
      "edit-" + (taskName ? "task" : "project") + "-option"
    );
    icon.classList.add("bi", "bi-pencil", "me-2");
    dropdownButton.setAttribute("data-bs-toggle", "modal");
    dropdownButton.setAttribute(
      "data-bs-target",
      "#edit-" + (taskName ? "task" : "project") + "-modal"
    );
  } else if (item === "Delete") {
    dropdownButton.classList.add(
      "delete-" + (taskName ? "task" : "project") + "-option"
    );
    icon.classList.add("bi", "bi-trash3", "me-2");
    dropdownButton.setAttribute("data-bs-toggle", "modal");
    dropdownButton.setAttribute(
      "data-bs-target",
      "#delete-" + (taskName ? "task" : "project") + "-modal"
    );
  }

  dropdownButton.prepend(icon);

  return dropdownButton;
};

/**
 * Renders the dropdown menu for a project or task.
 * @param {string[]} dropdownItems - Array of dropdown items.
 * @param {string} projectName - The name of the project.
 * @param {string} [taskName=""] - The name of the task (optional).
 * @returns {HTMLUListElement} - The rendered dropdown menu element.
 */
const renderDropdownMenu = (dropdownItems, projectName, taskName = "") => {
  const dropdownMenu = document.createElement("ul");
  dropdownMenu.classList.add("dropdown-menu");

  dropdownItems.forEach((item) => {
    const dropdownItem = document.createElement("li");
    const dropdownButton = renderDropdownButtons(item, projectName, taskName);

    dropdownItem.appendChild(dropdownButton);
    dropdownMenu.appendChild(dropdownItem);
  });

  return dropdownMenu;
};

/**
 * Renders the dropdown toggle for a project or task.
 * @param {Object} project - The project object.
 * @param {Object} [task=""] - The task object (optional).
 * @returns {HTMLElement} - The rendered dropdown toggle element.
 */
const renderDropdownToggle = (project, task = "") => {
  const dropdownContainer = document.createElement("div");
  const dropdownToggle = document.createElement("button");
  const dropdownMenu =
    task !== ""
      ? renderDropdownMenu(dropdownItems, project.name, task.name)
      : renderDropdownMenu(dropdownItems, project.name);
  const dropdownIcon = document.createElement("i");
  const visuallyHidden = document.createElement("span");

  dropdownContainer.classList.add("dropdown");
  dropdownToggle.classList.add("btn", "flex-grow-0", "dropdown-toggle");

  task !== ""
    ? dropdownToggle.classList.add("btn-sm")
    : dropdownToggle.classList.add("dropdown-toggle-split");
  dropdownToggle.setAttribute("data-bs-toggle", "dropdown");

  dropdownIcon.classList.add("bi", "bi-three-dots");
  visuallyHidden.classList.add("visually-hidden");
  visuallyHidden.textContent = "Toggle Dropdown";

  task !== "" &&
    task.status === "Complete" &&
    dropdownToggle.setAttribute("disabled", true);

  dropdownToggle.append(dropdownIcon, visuallyHidden);
  dropdownContainer.append(dropdownToggle, dropdownMenu);
  return task !== "" ? dropdownContainer : dropdownToggle;
};

/**
 * Renders the button group for a project.
 * @param {Object} project - The project object.
 * @returns {HTMLDivElement} - The rendered button group element.
 */
const renderButtonGroup = (project) => {
  const btnGroup = document.createElement("div");
  btnGroup.classList.add("btn-group", "w-100", "d-flex");

  const projectBtn = renderProjectButton(project);
  const dropdownToggle = renderDropdownToggle(project);
  const dropdownMenu = renderDropdownMenu(dropdownItems, project.name);

  btnGroup.append(projectBtn, dropdownToggle, dropdownMenu);

  return btnGroup;
};

/**
 * Renders the project button.
 * @param {Object} project - The project object.
 * @returns {HTMLButtonElement} - The rendered project button element.
 */
const renderProjectButton = (project) => {
  const projectBtn = document.createElement("button");
  projectBtn.classList.add(
    "project-btn",
    "btn",
    "text-start",
    "overflow-hidden",
    "text-truncate"
  );
  projectBtn.textContent = project.name;
  projectBtn.setAttribute("data-project", project.name);
  return projectBtn;
};

/**
 * Renders a project list item.
 * @param {Object} project - The project object.
 * @returns {HTMLLIElement} - The rendered project list item element.
 */
const renderProjectListItem = (project) => {
  const projectItem = document.createElement("li");
  projectItem.classList.add("project-item");

  const btnGroup = renderButtonGroup(project);
  projectItem.appendChild(btnGroup);

  return projectItem;
};

/**
 * Activates a project button.
 * @param {string} projectName - The name of the project to activate.
 */
const activateProjectBtn = (projectName) => {
  const projectBtns = document.querySelectorAll(".project-btn");

  projectBtns.forEach((btn) => {
    const btnParent = btn.parentNode;

    if (btn.classList.contains("active")) btn.classList.remove("active");
    if (btnParent.classList.contains("active", "btn-group"))
      btnParent.classList.remove("active");

    if (btn.getAttribute("data-project") === projectName) {
      btnParent.classList.contains("btn-group")
        ? btnParent.classList.add("active")
        : btn.classList.add("active");
    }
  });
};

/**
 * Renders the header for a project.
 * @param {string} projectName - The name of the project.
 */
const renderProjectHeader = (projectName) => {
  const projectTitle = document.createElement("h1");
  projectTitle.classList.add(
    "project-title",
    "fs-3",
    "fw-bold",
    "mb-4",
    "mx-auto"
  );
  projectTitle.textContent = projectName;
  projectHeader.appendChild(projectTitle);
};

/**
 * Renders the "Add Task" option for a project.
 * @param {string} projectName - The name of the project.
 */
const renderAddTaskOption = (projectName) => {
  const addTaskOption = document.createElement("button");
  const taskListItem = document.createElement("li");
  const addTaskIcon = document.createElement("i");

  taskListItem.classList.add("task-list-item", "col-12");
  addTaskIcon.classList.add("bi", "bi-plus-lg", "me-2");
  addTaskOption.classList.add(
    "add-task-option",
    "btn",
    "d-block",
    "px-0",
    "mx-auto",
    "border-0",
    "w-100",
    "text-start"
  );

  addTaskOption.setAttribute("data-bs-toggle", "modal");
  addTaskOption.setAttribute("data-bs-target", "#add-task-modal");
  addTaskOption.setAttribute("data-project", projectName);

  addTaskOption.textContent = "Add Task";
  addTaskOption.prepend(addTaskIcon);
  taskListItem.appendChild(addTaskOption);
  projectTaskList.appendChild(taskListItem);
};

/**
 * Renders a task list item.
 * @returns {HTMLLIElement} - The rendered task list item element.
 */
const renderTaskListItem = () => {
  const taskListItem = document.createElement("li");
  taskListItem.classList.add("task-list-item", "col-12");
  return taskListItem;
};

/**
 * Renders a task container.
 * @returns {HTMLDivElement} - The rendered task container element.
 */
const renderTaskContainer = () => {
  const taskContainer = document.createElement("div");
  taskContainer.classList.add(
    "task-item",
    "w-100",
    "mx-auto",
    "text-start",
    "d-flex"
  );
  return taskContainer;
};

/**
 * Renders the checkbox for a task.
 * @param {Object} project - The project object.
 * @param {Object} task - The task object.
 * @returns {HTMLDivElement} - The rendered task checkbox element.
 */
const renderTaskCheckbox = (project, task) => {
  const taskCheckboxContainer = document.createElement("div");
  const taskCheckbox = document.createElement("i");

  taskCheckboxContainer.classList.add("me-2");
  task.status === "Incomplete"
    ? taskCheckbox.classList.add("task-priority-icon", "bi", "bi-circle")
    : taskCheckbox.classList.add("task-priority-icon", "bi", "bi-check-circle");

  taskCheckbox.setAttribute("data-task", task.name);
  taskCheckbox.setAttribute("data-project", project.name);

  switch (task.priority) {
    case "High":
      taskCheckbox.classList.add("text-high-priority");
      break;
    case "Medium":
      taskCheckbox.classList.add("text-medium-priority");
      break;
    case "Low":
      taskCheckbox.classList.add("text-low-priority");
      break;
    default:
      break;
  }

  taskCheckboxContainer.appendChild(taskCheckbox);
  return taskCheckboxContainer;
};

/**
 * Renders the date text for a task.
 * @param {Object} task - The task object.
 * @returns {string} - The rendered task date text.
 */
const renderTaskDateText = (task) => {
  if (task.dueDate === "") return "";

  const currentDate = startOfDay(new Date());
  const startOfWeek = new Date(currentDate);
  const endOfWeek = endOfDay(addDays(startOfWeek, 6));
  const taskDate = startOfDay(new Date(task.dueDate));
  const endOfYearDate = endOfYear(currentDate);

  let taskDateText = "";

  if (task.status === "Complete") {
    taskDateText = "Completed";
  } else if (isBefore(taskDate, currentDate)) {
    taskDateText = "Overdue";
  } else if (isToday(taskDate)) {
    taskDateText = "Today";
  } else if (isTomorrow(taskDate)) {
    taskDateText = "Tomorrow";
  } else if (isAfter(taskDate, startOfWeek) && isBefore(taskDate, endOfWeek)) {
    taskDateText = format(taskDate, "EEEE");
  } else if (
    isAfter(taskDate, endOfWeek) &&
    isBefore(taskDate, endOfYearDate)
  ) {
    taskDateText = format(taskDate, "MMM d");
  } else {
    taskDateText = format(taskDate, "MMM d yyyy");
  }

  return taskDateText;
};

/**
 * Renders the details for a task.
 * @param {Object} project - The project object.
 * @param {Object} task - The task object.
 * @returns {HTMLDivElement} - The rendered task details element.
 */
const renderTaskDetails = (project, task) => {
  const taskDetails = document.createElement("div");
  const taskHeader = document.createElement("div");
  const taskName = document.createElement("div");
  const taskDropdown = renderDropdownToggle(project, task);
  const taskDescription = document.createElement("div");
  const taskDueDate = document.createElement("div");

  taskDetails.classList.add("flex-fill");
  taskHeader.classList.add("d-flex", "justify-content-between");
  taskName.classList.add("task-name");
  taskName.textContent = task.name;

  taskDescription.classList.add(
    "task-description",
    "text-muted",
    "fw-lighter",
    "fs-7"
  );
  taskDescription.textContent = task.description;

  taskDueDate.classList.add(
    "task-due-date",
    "text-muted",
    "fw-lighter",
    "fs-7"
  );
  taskDueDate.textContent = renderTaskDateText(task);

  taskHeader.append(taskName, taskDropdown);
  taskDetails.appendChild(taskHeader);
  if (task.description !== "") {
    taskDetails.appendChild(taskDescription);
  }
  if (task.dueDate !== "") {
    taskDetails.appendChild(taskDueDate);
  }

  return taskDetails;
};

/**
 * Renders task items for a project.
 * @param {Object} project - The project object.
 * @param {Object[]} tasks - Array of task objects.
 */
const renderTaskItems = (project, tasks) => {
  tasks.forEach((task) => {
    const taskListItem = renderTaskListItem(task);
    const taskContainer = renderTaskContainer(task);
    const taskCheckbox = renderTaskCheckbox(project, task);
    const taskDetails = renderTaskDetails(project, task);

    taskContainer.append(taskCheckbox, taskDetails);
    taskListItem.appendChild(taskContainer);
    projectTaskList.appendChild(taskListItem);
  });
};

/**
 * Sets the delete project name for modal confirmation.
 * @param {HTMLButtonElement} button - The delete project button.
 */
export const setDeleteProjectName = (button) => {
  const projectName = button.getAttribute("data-project");
  deleteProjectName.textContent = projectName;
};

/**
 * Sets the edit project name for modal form.
 * @param {HTMLButtonElement} button - The edit project button.
 */
export const setEditProjectName = (button) => {
  const projectName = button.getAttribute("data-project");
  editProjectNameInput.value = projectName;
  editProjectNameInput.setAttribute("data-project", projectName);
};

/**
 * Sets the delete task name for modal confirmation.
 * @param {HTMLButtonElement} button - The delete task button.
 */
export const setDeleteTaskName = (button) => {
  const taskName = button.getAttribute("data-task");
  deleteTaskName.textContent = taskName;
};

/**
 * Sets the delete task project for modal confirmation.
 * @param {HTMLButtonElement} button - The delete task button.
 */
export const setDeleteTaskProject = (button) => {
  const projectName = button.getAttribute("data-project");
  deleteTaskBtn.setAttribute("data-project", projectName);
};

/**
 * Toggles the collapse icon.
 * @param {Event} e - The click event.
 */
export const toggleCollapseIcon = (e) => {
  const icon = e.target.firstElementChild;
  const oldClass = icon.classList.contains("bi-chevron-down")
    ? "bi-chevron-down"
    : "bi-chevron-right";
  const newClass = icon.classList.contains("bi-chevron-down")
    ? "bi-chevron-right"
    : "bi-chevron-down";
  replaceIcon(icon, oldClass, newClass);
};

/**
 * Renders hover effect for add task button.
 * @param {Event} e - The mouseover event.
 */
export const renderAddTaskHoverEffect = (e) => {
  const buttonIcon = e.target.firstChild;
  const oldClass = buttonIcon.classList.contains("bi-plus-lg")
    ? "bi-plus-lg"
    : "bi-plus-circle-fill";
  const newClass = buttonIcon.classList.contains("bi-plus-lg")
    ? "bi-plus-circle-fill"
    : "bi-plus-lg";
  replaceIcon(buttonIcon, oldClass, newClass);
};

/**
 * Renders hover effect for task priority checkbox.
 * @param {Event} e - The mouseover event.
 */
export const renderTaskPriorityHoverEffect = (e) => {
  const taskCheckbox = e.target;
  const oldClass = taskCheckbox.classList.contains("bi-circle")
    ? "bi-circle"
    : "bi-check-circle";
  const newClass = taskCheckbox.classList.contains("bi-circle")
    ? "bi-check-circle"
    : "bi-circle";
  replaceIcon(taskCheckbox, oldClass, newClass);
};

/**
 * Renders project buttons.
 * @param {Object[]} projectArray - Array of project objects.
 */
export const renderProjectBtns = (projectArray) => {
  clearElement(projectList);

  projectArray.forEach((project) => {
    const projectItem = renderProjectListItem(project);
    projectList.appendChild(projectItem);
  });
};

/**
 * Renders project details.
 * @param {Object} project - The project object.
 */
export const renderProjectDetails = (project) => {
  clearProjectDetails();
  activateProjectBtn(project.name);
  renderProjectHeader(project.name);
  clearElement(projectTaskList);
  renderTaskItems(project, project.tasks);
  renderAddTaskOption(project.name);
};

/**
 * Renders details for all projects.
 * @param {Object[]} projectArray - Array of project objects.
 */
export const renderAllProjectDetails = (projectArray) => {
  clearProjectDetails();
  activateProjectBtn("All My Tasks");
  renderProjectHeader("All My Tasks");

  projectArray.forEach((project) => {
    renderTaskItems(project, project.tasks);
  });

  renderAddTaskOption("All My Tasks");
};

/**
 * Renders details for "My Day" project.
 * @param {Object[]} projectArray - Array of project objects.
 */
export const renderMyDayProjectDetails = (projectArray) => {
  clearProjectDetails();
  activateProjectBtn("My Day");
  renderProjectHeader("My Day");

  projectArray.forEach((project) => {
    const tasks = project.tasks.filter((task) => {
      const taskDate = startOfDay(new Date(task.dueDate));
      return isToday(taskDate);
    });

    renderTaskItems(project, tasks);
  });

  renderAddTaskOption("My Day");
};

/**
 * Renders details for "Next 7 Days" project.
 * @param {Object[]} projectArray - Array of project objects.
 */
export const renderNext7DaysProjectDetails = (projectArray) => {
  clearProjectDetails();
  activateProjectBtn("Next 7 Days");
  renderProjectHeader("Next 7 Days");

  const today = startOfDay(new Date());
  const startOfWeek = new Date(today);
  const endOfWeek = endOfDay(addDays(startOfWeek, 6));

  projectArray.forEach((project) => {
    const tasks = project.tasks.filter((task) => {
      const taskDate = startOfDay(new Date(task.dueDate));
      return (
        isToday(taskDate) ||
        (isAfter(taskDate, today) && isBefore(taskDate, endOfWeek))
      );
    });

    renderTaskItems(project, tasks);
  });

  renderAddTaskOption("Next 7 Days");
};

/**
 * Renders project dropdown options.
 * @param {Object[]} projectArray - Array of project objects.
 * @param {HTMLSelectElement} projectDropdown - The project dropdown element.
 */
export const renderProjectDropdown = (projectArray, projectDropdown) => {
  clearElement(projectDropdown);

  projectArray.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.name;
    option.textContent = project.name;
    projectDropdown.appendChild(option);
  });
};
