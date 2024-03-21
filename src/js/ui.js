const projectList = document.querySelector(".project-list");
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

      if (item === "Edit") {
        dropdownButton.classList.add("edit-project-option");
        dropdownButtonIcon.classList.add("bi", "bi-pencil");
        dropdownButton.setAttribute("data-bs-toggle", "modal");
        dropdownButton.setAttribute("data-bs-target", "#edit-project-modal");
      } else if (item === "Delete") {
        dropdownButton.classList.add("delete-project-option");
        dropdownButtonIcon.classList.add("bi", "bi-trash3");
        dropdownButton.setAttribute("data-bs-toggle", "modal");
        dropdownButton.setAttribute("data-bs-target", "#delete-project-modal");
      }

      dropdownButton.appendChild(dropdownButtonIcon);
      dropdownButton.appendChild(document.createTextNode(" "));
      dropdownButton.appendChild(document.createTextNode(item));
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

      if (item === "Edit") {
        dropdownButton.classList.add("edit-task-option");
        dropdownButtonIcon.classList.add("bi", "bi-pencil");
        dropdownButton.setAttribute("data-bs-toggle", "modal");
        dropdownButton.setAttribute("data-bs-target", "#edit-task-modal");
        dropdownButton.setAttribute("data-task", taskName);
        dropdownButton.setAttribute("data-project", projectName);
      } else if (item === "Delete") {
        dropdownButton.classList.add("delete-task-option");
        dropdownButtonIcon.classList.add("bi", "bi-trash3");
        dropdownButton.setAttribute("data-bs-toggle", "modal");
        dropdownButton.setAttribute("data-bs-target", "#delete-task-modal");
        dropdownButton.setAttribute("data-task", taskName);
        dropdownButton.setAttribute("data-project", projectName);
      }

      dropdownButton.appendChild(dropdownButtonIcon);
      dropdownButton.appendChild(document.createTextNode(" "));
      dropdownButton.appendChild(document.createTextNode(item));
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

    visuallyHidden.classList.add("visually-hidden");
    visuallyHidden.textContent = "Toggle Dropdown";

    projectBtn.classList.add("project-btn", "btn");
    projectBtn.textContent = project.name;

    dropdownToggle.classList.add(
      "btn",
      "dropdown-toggle",
      "dropdown-toggle-split"
    );
    dropdownToggle.setAttribute("data-bs-toggle", "dropdown");
    dropdownToggle.appendChild(visuallyHidden);

    btnGroup.classList.add("btn-group");
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

const renderProjectHeader = (projectName) => {
  const projectTitle = document.createElement("h2");
  projectTitle.classList.add("project-title");
  projectTitle.textContent = projectName;
  projectHeader.appendChild(projectTitle);
};

const renderAddTaskOption = (projectName) => {
  const addTaskOption = document.createElement("button");
  const taskListItem = document.createElement("li");
  const addTaskIcon = document.createElement("i");

  taskListItem.classList.add("task-list-item", "col-12");
  addTaskIcon.classList.add("bi", "bi-plus");
  addTaskOption.classList.add(
    "add-task-option",
    "btn",
    "bg-grey",
    "w-100",
    "text-start",
    "rounded-0"
  );

  addTaskOption.setAttribute("data-bs-toggle", "modal");
  addTaskOption.setAttribute("data-bs-target", "#add-task-modal");
  addTaskOption.setAttribute("data-project", projectName);

  addTaskOption.appendChild(addTaskIcon);
  addTaskOption.appendChild(document.createTextNode("  Add Task"));
  taskListItem.appendChild(addTaskOption);
  projectTaskList.appendChild(taskListItem);
};

const clearProjectDetails = () => {
  while (projectHeader.firstChild) {
    projectHeader.removeChild(projectHeader.firstChild);
  }
  while (projectTaskList.firstChild) {
    projectTaskList.removeChild(projectTaskList.firstChild);
  }
};

const renderTaskBtns = (project, tasks) => {
  tasks.forEach((task) => {
    const taskListItem = document.createElement("li");
    const btnGroup = document.createElement("div");
    const taskBtn = document.createElement("button");
    const taskCheckboxContainer = document.createElement("div");
    const taskCheckbox = document.createElement("input");
    const taskDetails = document.createElement("div");
    const taskName = document.createElement("p");
    const taskDescription = document.createElement("p");
    const taskDueDate = document.createElement("p");
    const dropdownToggle = document.createElement("button");
    const dropdownMenu = renderDropdownMenu(
      dropdownItems,
      project.name,
      task.name
    );
    const visuallyHidden = document.createElement("span");
    const horizontalLine = document.createElement("div");

    visuallyHidden.classList.add("visually-hidden");
    visuallyHidden.textContent = "Toggle Dropdown";

    taskListItem.classList.add("task-list-item", "col-12");
    taskBtn.classList.add(
      "task-btn",
      "btn",
      "text-start",
      "d-flex",
      "border-0",
      "rounded-0",
      "border-start",
      "border-5"
    );
    taskCheckbox.classList.add("task-checkbox", "form-check-input");
    taskCheckbox.setAttribute("type", "checkbox");
    taskName.classList.add("task-name", "mb-1");
    taskDescription.classList.add(
      "task-description",
      "text-muted",
      "fw-lighter",
      "fs-7",
      "mb-1"
    );
    taskDueDate.classList.add(
      "task-due-date",
      "text-muted",
      "fw-lighter",
      "fs-7",
      "mb-1"
    );
    horizontalLine.classList.add("horizontal-line");

    if (task.priority === "low") {
      taskBtn.classList.add("border-primary");
    } else if (task.priority === "medium") {
      taskBtn.classList.add("border-warning");
    } else if (task.priority === "high") {
      taskBtn.classList.add("border-danger");
    }

    taskCheckboxContainer.classList.add("form-check");
    taskCheckboxContainer.appendChild(taskCheckbox);
    taskDetails.classList.add("task-details");
    taskDetails.append(taskName, taskDescription, taskDueDate);
    taskBtn.append(taskCheckboxContainer, taskDetails);
    dropdownToggle.classList.add(
      "btn",
      "dropdown-toggle",
      "dropdown-toggle-split",
      "flex-grow-0"
    );
    dropdownToggle.setAttribute("data-bs-toggle", "dropdown");
    dropdownToggle.appendChild(visuallyHidden);

    btnGroup.classList.add("btn-group", "bg-grey", "w-100", "rounded-0");
    btnGroup.append(taskBtn, dropdownToggle, dropdownMenu);

    taskListItem.appendChild(btnGroup);
    projectTaskList.append(taskListItem, horizontalLine);

    taskName.textContent = task.name;
    taskDescription.textContent = task.description;
    taskDueDate.textContent = task.dueDate;
  });
};

export const renderProjectDetails = (project) => {
  clearProjectDetails();
  renderProjectHeader(project.name);
  clearTaskBtns();
  renderTaskBtns(project, project.tasks);
  renderAddTaskOption(project.name);
};

export const renderAllProjectDetails = (projectArray) => {
  clearProjectDetails();
  renderProjectHeader("All My Tasks");

  projectArray.forEach((project) => {
    renderTaskBtns(project, project.tasks);
  });

  renderAddTaskOption("All My Tasks");
};

export const renderMyDayProjectDetails = (projectArray) => {
  clearProjectDetails();
  renderProjectHeader("My Day");

  const today = new Date().toISOString().split("T")[0];

  projectArray.forEach((project) => {
    const tasks = project.tasks.filter((task) => task.dueDate === today);
    renderTaskBtns(project, tasks);
  });

  renderAddTaskOption("My Day");
};

export const renderNext7DaysProjectDetails = (projectArray) => {
  clearProjectDetails();
  renderProjectHeader("Next 7 Days");

  const today = new Date();
  const next7Days = new Date(today);
  next7Days.setDate(today.getDate() + 7);
  const next7DaysISO = next7Days.toISOString().split("T")[0];

  projectArray.forEach((project) => {
    const tasks = project.tasks.filter((task) => task.dueDate <= next7DaysISO);
    renderTaskBtns(project, tasks);
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
