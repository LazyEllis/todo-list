import '../style.scss';
import * as bootstrap from 'bootstrap';
import getFormData from './form';
import {
  addProject,
  findProject,
  getProjects,
  deleteProject,
  editProject,
} from './project';
import {
  renderProjectBtns,
  setDeleteProjectName,
  setEditProjectName,
  renderProjectHeader,
  activateProjectBtn,
} from './ui';

const sidebar = document.querySelector('.sidebar');
const addProjectForm = document.querySelector('#add-project-form');
const projectNameInput = document.querySelector('#project-name');
const addProjectBtn = document.querySelector('.add-project-btn');
const deleteProjectBtn = document.querySelector('.delete-project-btn');
const editProjectForm = document.querySelector('#edit-project-form');
const editProjectNameInput = document.querySelector('#edit-project-name');
const editProjectBtn = document.querySelector('.edit-project-btn');
const defaultProject = document.querySelector('.default-project');

const validateProjectName = (nameInput, submitBtn) => {
  if (findProject(nameInput.value.trim()) !== undefined) {
    nameInput.setCustomValidity('Project already exists');
  } else {
    nameInput.setCustomValidity('');
  }

  if (nameInput.checkValidity()) {
    submitBtn.setAttribute('data-bs-dismiss', 'modal');
  } else {
    submitBtn.removeAttribute('data-bs-dismiss');
  }
};

projectNameInput.addEventListener('input', () => {
  validateProjectName(projectNameInput, addProjectBtn);
});

addProjectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const project = getFormData(addProjectForm);
  addProject(project.name.trim());
  renderProjectBtns(getProjects());
  addProjectForm.reset();
});

sidebar.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-project-option')) {
    setDeleteProjectName(e.target);
  } else if (e.target.classList.contains('edit-project-option')) {
    setEditProjectName(e.target);
  }
  if (e.target.classList.contains('project-btn')) {
    const projectName = e.target.textContent;
    renderProjectHeader(projectName);
  }
});

deleteProjectBtn.addEventListener('click', () => {
  const projectName = document.querySelector(
    '.delete-project-name'
  ).textContent;
  deleteProject(projectName);
  renderProjectBtns(getProjects());

  const projectTitle = document.querySelector('.project-title');
  if (projectTitle.textContent === projectName) {
    renderProjectHeader(defaultProject.textContent);
  }
});

editProjectNameInput.addEventListener('input', () => {
  validateProjectName(editProjectNameInput, editProjectBtn);
});

editProjectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const projectName = editProjectNameInput.getAttribute('data-project');
  const newProject = getFormData(editProjectForm);
  editProject(projectName, newProject.name.trim());
  renderProjectBtns(getProjects());
  editProjectForm.reset();

  const projectTitle = document.querySelector('.project-title');
  if (projectTitle.textContent === projectName) {
    renderProjectHeader(newProject.name);
  }
});
