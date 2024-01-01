const getFormData = (form) => {
  const data = new FormData(form);
  const formData = Object.fromEntries(data.entries());
  return formData;
};

export default getFormData;
