document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('capturar').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: getFields,
      }, function(results) {
        if (results && results.length > 0 && results[0].result) {
          let { setor, chamado } = results[0].result;
          chamado = formatChamado(chamado);
          document.getElementById('setor').value = setor;
          document.getElementById('chamado').value = chamado;
          document.getElementById('mv').value = '01';
          document.getElementById('vv').value = '01';
        }
      });
    });
  });

  document.getElementById('gerar').addEventListener('click', function() {
    const setor = document.getElementById('setor').value;
    let chamado = document.getElementById('chamado').value;
    const mv = document.getElementById('mv').value;
    const vv = document.getElementById('vv').value;

    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    chamado = formatChamado(chamado);

    const padrao = `BR-${ano}-${mes}-${dia}-${setor}-${chamado}-${mv}-${vv}`;

    document.getElementById('resultado').textContent = padrao;

    navigator.clipboard.writeText(padrao).then(function() {
      console.log('Texto copiado para a área de transferência.');
    }, function() {
      console.error('Falha ao copiar o texto para a área de transferência.');
    });
  });
});

function getFields() {
  const chamadoElement = document.querySelector('span.d-inline.m-l-1.ng-binding');
  const setorElement = document.querySelector('label[ng-click="toggleEditClient()"]');

  const chamado = chamadoElement ? chamadoElement.innerText.trim().replace('#', '') : '';
  const setor = setorElement ? setorElement.innerText.trim().substring(setorElement.innerText.indexOf('Setor') + 7).substring(0, 5) : '';

  return { setor, chamado };
}

function formatChamado(chamado) {
  const digitosChamado = chamado.match(/\d+/g);
  if (digitosChamado && digitosChamado.length > 0) {
    let numeroChamado = digitosChamado[0].substring(0, 6);
    numeroChamado = numeroChamado.padStart(6, '0');
    return numeroChamado;
  }
  return '';
}
