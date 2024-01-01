const projectList = document.querySelector('.project-list');
const deleteProjectName = document.querySelector('.delete-project-name');
const editProjectNameInput = document.querySelector('#edit-project-name');
const projectHeader = document.querySelector('.project-header');
const dropdownItems = ['Edit', 'Delete'];

const clearProjectBtns = () => {
  while (projectList.firstChild) {
    projectList.removeChild(projectList.firstChild);
  }
};

const renderDropdownMenu = (dropdownItems, projectName) => {
  const dropdownMenu = document.createElement('ul');
  dropdownMenu.classList.add('dropdown-menu');

  dropdownItems.forEach((item) => {
    const dropdownItem = document.createElement('li');
    const dropdownButton = document.createElement('button');
    const dropdownButtonIcon = document.createElement('i');

    dropdownItem.appendChild(dropdownButton);
    dropdownMenu.appendChild(dropdownItem);
    dropdownButton.classList.add('dropdown-item');
    dropdownButton.setAttribute('data-project', projectName);

    if (item === 'Edit') {
      dropdownButton.classList.add('edit-project-option');
      dropdownButtonIcon.classList.add('bi', 'bi-pencil');
      dropdownButton.setAttribute('data-bs-toggle', 'modal');
      dropdownButton.setAttribute('data-bs-target', '#edit-project-modal');
    } else if (item === 'Delete') {
      dropdownButton.classList.add('delete-project-option');
      dropdownButtonIcon.classList.add('bi', 'bi-trash3');
      dropdownButton.setAttribute('data-bs-toggle', 'modal');
      dropdownButton.setAttribute('data-bs-target', '#delete-project-modal');
    }

    dropdownButton.appendChild(dropdownButtonIcon);
    dropdownButton.appendChild(document.createTextNode(' '));
    dropdownButton.appendChild(document.createTextNode(item));
  });

  return dropdownMenu;
};

export const renderProjectBtns = (projectArray) => {
  clearProjectBtns();

  projectArray.forEach((project) => {
    const projectItem = document.createElement('li');
    const btnGroup = document.createElement('div');
    const projectBtn = document.createElement('button');
    const dropdownToggle = document.createElement('button');
    const dropdownMenu = renderDropdownMenu(dropdownItems, project.name);
    const visuallyHidden = document.createElement('span');

    visuallyHidden.classList.add('visually-hidden');
    visuallyHidden.textContent = 'Toggle Dropdown';

    projectBtn.classList.add('project-btn', 'btn');
    projectBtn.textContent = project.name;

    dropdownToggle.classList.add(
      'btn',
      'dropdown-toggle',
      'dropdown-toggle-split'
    );
    dropdownToggle.setAttribute('data-bs-toggle', 'dropdown');
    dropdownToggle.appendChild(visuallyHidden);

    btnGroup.classList.add('btn-group');
    btnGroup.append(projectBtn, dropdownToggle, dropdownMenu);

    projectItem.append(btnGroup);
    projectItem.classList.add('project-item');

    projectList.appendChild(projectItem);
  });
};

export const setDeleteProjectName = (button) => {
  const projectName = button.getAttribute('data-project');
  deleteProjectName.textContent = projectName;
};

export const setEditProjectName = (button) => {
  const projectName = button.getAttribute('data-project');
  editProjectNameInput.value = projectName;
  editProjectNameInput.setAttribute('data-project', projectName);
};

const clearProjectDetails = () => {
  while (projectHeader.firstChild) {
    projectHeader.removeChild(projectHeader.firstChild);
  }
};

export const renderProjectHeader = (projectName) => {
  clearProjectDetails();
  const projectTitle = document.createElement('h2');
  projectTitle.classList.add('project-title');
  projectTitle.textContent = projectName;
  projectHeader.appendChild(projectTitle);
};
