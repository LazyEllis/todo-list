/**
 * Extracts form data into a JavaScript object.
 * @param {HTMLFormElement} form - The form element to extract data from.
 * @returns {Object} - The extracted form data as an object.
 */
const getFormData = (form) => Object.fromEntries(new FormData(form));

export default getFormData;
