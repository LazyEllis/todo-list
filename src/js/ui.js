const projectList = document.querySelector("#project-list");
const deleteProjectName = document.querySelector(".delete-project-name");
const editProjectNameInput = document.querySelector("#edit-project-name");
const projectHeader = document.querySelector(".project-header");
const projectTaskList = document.querySelector(".project-task-list");
const deleteTaskName = document.querySelector(".delete-task-name");
const deleteTaskBtn = document.querySelector(".delete-task-btn");
const dropdownItems = ["Edit", "Delete"];

const clearProjectBtns = () => {
  while (projectList.firstChild) {
    projectList.removeChild(projectList.firstChild);
  }
};

const clearTaskBtns = () => {
  while (projectTaskList.firstChild) {
    projectTaskList.removeChild(projectTaskList.firstChild);
  }
};

const replaceIcon = (icon, iconClass, newIconClass) => {
  icon.classList.remove(iconClass);
  icon.classList.add(newIconClass);
};

export const toggleCollapseIcon = (e) => {
  const icon = e.target.firstElementChild;
  icon.classList.contains("bi-chevron-down")
    ? replaceIcon(icon, "bi-chevron-down", "bi-chevron-right")
    : replaceIcon(icon, "bi-chevron-right", "bi-chevron-down");
};

const renderDropdownMenu = (dropdownItems, projectName, taskName = "") => {
  const dropdownMenu = document.createElement("ul");
  dropdownMenu.classList.add("dropdown-menu");

  if (taskName === "") {
    dropdownItems.forEach((item) => {
      const dropdownItem = document.createElement("li");
      const dropdownButton = document.createElement("button");
      const dropdownButtonIcon = document.createElement("i");

      dropdownItem.appendChild(dropdownButton);
      dropdownMenu.appendChild(dropdownItem);
      dropdownButton.classList.add("dropdown-item");
      dropdownButton.setAttribute("data-project", projectName);
      dropdownButton.textContent = item;

      if (item === "Edit") {
        dropdownButton.classList.add("edit-project-option");
        dropdownButtonIcon.classList.add("bi", "bi-pencil", "me-2");
        dropdownButton.setAttribute("data-bs-toggle", "modal");
        dropdownButton.setAttribute("data-bs-target", "#edit-project-modal");
      } else if (item === "Delete") {
        dropdownButton.classList.add("delete-project-option");
        dropdownButtonIcon.classList.add("bi", "bi-trash3", "me-2");
        dropdownButton.setAttribute("data-bs-toggle", "modal");
        dropdownButton.setAttribute("data-bs-target", "#delete-project-modal");
      }

      dropdownButton.prepend(dropdownButtonIcon);
    });
  } else {
    dropdownItems.forEach((item) => {
      const dropdownItem = document.createElement("li");
      const dropdownButton = document.createElement("button");
      const dropdownButtonIcon = document.createElement("i");

      dropdownItem.appendChild(dropdownButton);
      dropdownMenu.appendChild(dropdownItem);
      dropdownButton.classList.add("dropdown-item");
      dropdownButton.setAttribute("data-project", projectName);
      dropdownButton.setAttribute("data-task", taskName);
      dropdownButton.textContent = item;

      if (item === "Edit") {
        dropdownButton.classList.add("edit-task-option");
        dropdownButtonIcon.classList.add("bi", "bi-pencil", "me-2");
        dropdownButton.setAttribute("data-bs-toggle", "modal");
        dropdownButton.setAttribute("data-bs-target", "#edit-task-modal");
        dropdownButton.setAttribute("data-task", taskName);
        dropdownButton.setAttribute("data-project", projectName);
      } else if (item === "Delete") {
        dropdownButton.classList.add("delete-task-option");
        dropdownButtonIcon.classList.add("bi", "bi-trash3", "me-2");
        dropdownButton.setAttribute("data-bs-toggle", "modal");
        dropdownButton.setAttribute("data-bs-target", "#delete-task-modal");
        dropdownButton.setAttribute("data-task", taskName);
        dropdownButton.setAttribute("data-project", projectName);
      }

      dropdownButton.prepend(dropdownButtonIcon);
    });
  }

  return dropdownMenu;
};

export const renderProjectBtns = (projectArray) => {
  clearProjectBtns();

  projectArray.forEach((project) => {
    const projectItem = document.createElement("li");
    const btnGroup = document.createElement("div");
    const projectBtn = document.createElement("button");
    const dropdownToggle = document.createElement("button");
    const dropdownMenu = renderDropdownMenu(dropdownItems, project.name);
    const visuallyHidden = document.createElement("span");
    const ellipsisIcon = document.createElement("i");

    visuallyHidden.classList.add("visually-hidden");
    visuallyHidden.textContent = "Toggle Dropdown";

    ellipsisIcon.classList.add("bi", "bi-three-dots");

    projectBtn.classList.add(
      "project-btn",
      "btn",
      "text-start",
      "overflow-hidden",
      "text-truncate"
    );
    projectBtn.textContent = project.name;
    projectBtn.setAttribute("data-project", project.name);

    dropdownToggle.classList.add(
      "btn",
      "dropdown-toggle",
      "dropdown-toggle-split",
      "flex-grow-0"
    );
    dropdownToggle.setAttribute("data-bs-toggle", "dropdown");
    dropdownToggle.append(visuallyHidden, ellipsisIcon);

    btnGroup.classList.add("btn-group", "w-100", "d-flex");
    btnGroup.append(projectBtn, dropdownToggle, dropdownMenu);

    projectItem.append(btnGroup);
    projectItem.classList.add("project-item");

    projectList.appendChild(projectItem);
  });
};

export const setDeleteProjectName = (button) => {
  const projectName = button.getAttribute("data-project");
  deleteProjectName.textContent = projectName;
};

export const setEditProjectName = (button) => {
  const projectName = button.getAttribute("data-project");
  editProjectNameInput.value = projectName;
  editProjectNameInput.setAttribute("data-project", projectName);
};

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

export const renderAddTaskHoverEffect = (e) => {
  const buttonIcon = e.target.firstChild;
  buttonIcon.classList.contains("bi-plus-lg")
    ? replaceIcon(buttonIcon, "bi-plus-lg", "bi-plus-circle-fill")
    : replaceIcon(buttonIcon, "bi-plus-circle-fill", "bi-plus-lg");
};

const clearProjectDetails = () => {
  while (projectHeader.firstChild) {
    projectHeader.removeChild(projectHeader.firstChild);
  }
  while (projectTaskList.firstChild) {
    projectTaskList.removeChild(projectTaskList.firstChild);
  }
};

const renderTaskListItem = () => {
  const taskListItem = document.createElement("li");
  taskListItem.classList.add("task-list-item", "col-12");
  return taskListItem;
};

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

const renderTaskCheckbox = (task) => {
  const taskCheckboxContainer = document.createElement("div");
  const taskCheckbox = document.createElement("i");

  taskCheckboxContainer.classList.add("priority", "me-2");
  taskCheckbox.classList.add("bi", "bi-circle");

  if (task.priority === "High") {
    taskCheckbox.classList.add("text-high-priority");
  } else if (task.priority === "Medium") {
    taskCheckbox.classList.add("text-medium-priority");
  } else if (task.priority === "Low") {
    taskCheckbox.classList.add("text-low-priority");
  }

  taskCheckboxContainer.appendChild(taskCheckbox);
  return taskCheckboxContainer;
};

const renderTaskDropdown = (project, task) => {
  const dropdownContainer = document.createElement("div");
  const dropdownToggle = document.createElement("button");
  const dropdownMenu = renderDropdownMenu(
    dropdownItems,
    project.name,
    task.name
  );
  const dropdownIcon = document.createElement("i");
  const visuallyHidden = document.createElement("span");

  dropdownContainer.classList.add("dropdown");
  dropdownToggle.classList.add(
    "btn",
    "btn-sm",
    "dropdown-toggle",
    "flex-grow-0"
  );
  dropdownToggle.setAttribute("data-bs-toggle", "dropdown");

  dropdownIcon.classList.add("bi", "bi-three-dots");
  visuallyHidden.classList.add("visually-hidden");
  visuallyHidden.textContent = "Toggle Dropdown";

  dropdownToggle.append(dropdownIcon, visuallyHidden);
  dropdownContainer.append(dropdownToggle, dropdownMenu);
  return dropdownContainer;
};

const renderTaskDetails = (project, task) => {
  const taskDetails = document.createElement("div");
  const taskHeader = document.createElement("div");
  const taskName = document.createElement("div");
  const taskDropdown = renderTaskDropdown(project, task);
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
  taskDueDate.textContent = task.dueDate;

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

const renderTaskItems = (project, tasks) => {
  tasks.forEach((task) => {
    const taskListItem = renderTaskListItem(task);
    const taskContainer = renderTaskContainer(task);
    const taskCheckbox = renderTaskCheckbox(task);
    const taskDetails = renderTaskDetails(project, task);

    taskContainer.append(taskCheckbox, taskDetails);
    taskListItem.appendChild(taskContainer);
    projectTaskList.appendChild(taskListItem);
  });
};

export const renderProjectDetails = (project) => {
  clearProjectDetails();
  activateProjectBtn(project.name);
  renderProjectHeader(project.name);
  clearTaskBtns();
  renderTaskItems(project, project.tasks);
  renderAddTaskOption(project.name);
};

export const renderAllProjectDetails = (projectArray) => {
  clearProjectDetails();
  activateProjectBtn("All My Tasks");
  renderProjectHeader("All My Tasks");

  projectArray.forEach((project) => {
    renderTaskItems(project, project.tasks);
  });

  renderAddTaskOption("All My Tasks");
};

export const renderMyDayProjectDetails = (projectArray) => {
  clearProjectDetails();
  activateProjectBtn("My Day");
  renderProjectHeader("My Day");

  const today = new Date().toISOString().split("T")[0];

  projectArray.forEach((project) => {
    const tasks = project.tasks.filter((task) => task.dueDate === today);
    renderTaskItems(project, tasks);
  });

  renderAddTaskOption("My Day");
};

export const renderNext7DaysProjectDetails = (projectArray) => {
  clearProjectDetails();
  activateProjectBtn("Next 7 Days");
  renderProjectHeader("Next 7 Days");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const next7Days = new Date(today);
  next7Days.setDate(next7Days.getDate() + 7);
  next7Days.setHours(23, 59, 59, 999);

  projectArray.forEach((project) => {
    const tasks = project.tasks.filter((task) => {
      const taskDueDate = new Date(task.dueDate);
      return taskDueDate >= today && taskDueDate <= next7Days;
    });
    renderTaskItems(project, tasks);
  });

  renderAddTaskOption("Next 7 Days");
};

export const renderProjectDropdown = (projectArray, projectDropdown) => {
  while (projectDropdown.firstChild) {
    projectDropdown.removeChild(projectDropdown.firstChild);
  }

  projectArray.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.name;
    option.textContent = project.name;
    projectDropdown.appendChild(option);
  });
};

export const setDeleteTaskName = (button) => {
  const taskName = button.getAttribute("data-task");
  deleteTaskName.textContent = taskName;
};

export const setDeleteTaskProject = (button) => {
  const projectName = button.getAttribute("data-project");
  deleteTaskBtn.setAttribute("data-project", projectName);
};
