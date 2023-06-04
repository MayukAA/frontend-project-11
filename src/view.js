const handleProcessState = (elements, processState, state) => {
  switch (processState) {
    case 'filling':
      break;

    case 'successful':
      elements.input.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = 'RSS успешно загружен'; // i18
      elements.form.reset();
      elements.input.focus();
      break;

    case 'failed':
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      elements.feedback.textContent = state.error.pop(); // MVC error
      break;

    default:
      break;
  }
};

export default (elements, initialState) => (path, value) => {
  switch (path) {
    case 'processState':
      handleProcessState(elements, value, initialState);
      break;

    default:
      break;
  }
};
