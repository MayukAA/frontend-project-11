const handleProcessState = (elements, processState, state, i18nInstance) => {
  switch (processState) {
    case 'successful':
      elements.input.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      // eslint-disable-next-line no-param-reassign
      elements.feedback.textContent = i18nInstance.t('success');
      elements.form.reset();
      elements.input.focus();
      break;

    case 'failed':
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      // eslint-disable-next-line no-param-reassign
      elements.feedback.textContent = i18nInstance.t(state.error);
      break;

    default:
      break;
  }
};

export default (elements, initialState, i18nInstance) => (path, value) => {
  switch (path) {
    case 'processState':
      handleProcessState(elements, value, initialState, i18nInstance);
      break;

    default:
      break;
  }
};
