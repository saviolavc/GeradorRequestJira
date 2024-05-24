function getFields() {
  const chamadoElement = document.querySelector('span.d-inline.m-l-1.ng-binding');
  const setorElement = document.querySelector('label.label-title.overflow-text.m-b-0.pull-left.cursor-pointer.ng-binding');

  const chamado = chamadoElement ? chamadoElement.innerText.replace('#', '') : '';
  const setor = setorElement ? setorElement.innerText.trim().substring(0, 5) : '';

  return { setor, chamado };
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message === 'getFields') {
    const fields = getFields();
    sendResponse(fields);
  }
});
