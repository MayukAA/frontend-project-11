const renderContainer = (arg, elements, i18nInstance) => {
  const elDivBorder = document.createElement('div');
  elDivBorder.classList.add('card', 'border-0');

  const elDivBody = document.createElement('div');
  elDivBody.classList.add('card-body');

  const elUl = document.createElement('ul');
  elUl.classList.add('list-group', 'border-0', 'rounded-0');

  const elH2 = document.createElement('h2');
  elH2.classList.add('card-title', 'h4');
  elH2.textContent = i18nInstance.t(arg);

  if (arg === 'feeds') {
    elements.containerFeeds.append(elDivBorder);
  } else {
    elements.containerPosts.append(elDivBorder);
  }
  elDivBorder.append(elDivBody);
  elDivBorder.append(elUl);
  elDivBody.append(elH2);
};

const renderFeeds = (elements, applyData, i18nInstance) => {
  const [applyDataArgs] = applyData.args;

  if (applyData.result === 1) {
    renderContainer('feeds', elements, i18nInstance);
  }

  const elUl = elements.containerFeeds.querySelector('.list-group');

  const elLi = document.createElement('li');
  elLi.classList.add('list-group-item', 'border-0', 'border-end-0');

  const elH3 = document.createElement('h3');
  elH3.classList.add('h6', 'm-0');
  elH3.textContent = applyDataArgs.title;

  const elP = document.createElement('p');
  elP.classList.add('m-0', 'small', 'text-black-50');
  elP.textContent = applyDataArgs.description;

  elUl.prepend(elLi);
  elLi.append(elH3);
  elLi.append(elP);
};

const renderPosts = (elements, applyData, i18nInstance) => {
  const [applyDataArgs] = applyData.args;

  if (applyData.result === 1) {
    renderContainer('posts', elements, i18nInstance);
  }

  const elUl = elements.containerPosts.querySelector('.list-group');

  applyDataArgs.forEach((arg) => {
    const elLi = document.createElement('li');
    elLi.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const elA = document.createElement('a');
    elA.classList.add('fw-bold');
    elA.setAttribute('href', arg.link);
    // elA.setAttribute('data-id', '2');
    elA.setAttribute('target', '_blank');
    elA.setAttribute('rel', 'noopener noreferrer');
    elA.textContent = arg.title;

    const elButton = document.createElement('button');
    elButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    elButton.setAttribute('type', 'button');
    // elButton.setAttribute('data-id', '2');
    elButton.setAttribute('data-bs-toggle', 'modal');
    elButton.setAttribute('data-bs-target', '#modal');
    elButton.textContent = i18nInstance.t('view');

    elUl.prepend(elLi);
    elLi.append(elA);
    elLi.append(elButton);
  });
};

const handleProcessState = (elements, processState, state, i18nInstance) => {
  switch (processState) {
    case 'filling':
      elements.input.classList.remove('is-invalid');
      elements.feedback.classList.remove('text-danger');
      // eslint-disable-next-line no-param-reassign
      elements.feedback.textContent = '';
      break;

    case 'sending':
      elements.input.setAttribute('readonly', 'true');
      // eslint-disable-next-line no-param-reassign
      elements.submitButton.disabled = true;
      break;

    case 'successful':
      elements.input.removeAttribute('readonly');
      elements.submitButton.removeAttribute('disabled');
      elements.feedback.classList.add('text-success');
      // eslint-disable-next-line no-param-reassign
      elements.feedback.textContent = i18nInstance.t('success');
      elements.form.reset();
      elements.input.focus();
      break;

    case 'failed':
      elements.input.removeAttribute('readonly');
      elements.submitButton.removeAttribute('disabled');
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

export default (elements, initialState, i18nInstance) => (path, value, prevValue, applyData) => {
  switch (path) {
    case 'processState':
      handleProcessState(elements, value, initialState, i18nInstance);
      break;

    case 'feedsData':
      renderFeeds(elements, applyData, i18nInstance);
      break;

    case 'postsData':
      renderPosts(elements, applyData, i18nInstance);
      break;

    default:
      break;
  }
};
