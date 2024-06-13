document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('capturar').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: getFields,
      }, function(results) {
        if (results && results.length > 0 && results[0].result) {
          const { setor, chamado, descricao} = results[0].result;
          document.getElementById('setor').value = setor;
          document.getElementById('chamado').value = chamado; //? `${chamado.slice(0, 6)}` : '';
          document.getElementById('descricao').value = descricao;
          document.getElementById('mv').value = '01';
          document.getElementById('vv').value = '01'; 
        }
      });
    });
  });

  document.getElementById('gerar').addEventListener('click', function() {
    const setor = document.getElementById('setor').value;
    const chamado = document.getElementById('chamado').value;
    const descricao = document.getElementById('descricao').value;
    const mv = document.getElementById('mv').value;
    const vv = document.getElementById('vv').value;


    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    const chamadoFormatado = chamado ? chamado.trim().replace('-', '') : '';
    const setorFormatado = removerAcentosECaracteresEspeciais(setor);
    const padrao = `BR-${ano}-${mes}-${dia}-${setorFormatado}-${chamadoFormatado}-${mv}-${vv}`;
    //padrão de request para usar na descrição de request do SAP
    document.getElementById('resultado').textContent = padrao;

    const nomeChamadoFormatado = `Transporte de request - [${chamadoFormatado}] - ${descricao} - [${vv}]`;
    document.getElementById('nomeChamadoFormatado').textContent = nomeChamadoFormatado;

  navigator.clipboard.writeText(padrao).then(function() {
      console.log('Texto copiado para a área de transferência.');
    }, function() {
      console.error('Falha ao copiar o texto para a área de transferência.');
    });
  });
});

function getFields() {
  /*
  const chamadoElement = document.querySelector('span.cursor-pointer');
  const setorElement = document.querySelector('span.font-ticket-list');

  const chamado = chamadoElement.innerText; //? chamadoElement.innerText.trim().replace('#', '').split(' - ')[0] : '';
  const setor = setorElement ? setorElement.innerText.trim().substring(5, 11) : '';
  
  const numchamado = document.querySelector('span.css-1gd7hga')
  return { setor, chamado, numchamado};
  */

  //const setorElement = document.querySelector('span.css-1vrpaoz');
  const setorElement = document.querySelector('div[data-testid="issue.views.field.single-line-text-inline-edit.read-view.customfield_10178"]');
  // Seleciona todos os elementos <span> com a classe css-1gd7hga
  let chamado = '';
  const todosElementos = document.querySelectorAll('span.css-1gd7hga');

  var descricao = "";

    var elementosH1 = document.querySelectorAll('h1[data-testid="issue.views.issue-base.foundation.summary.heading"]');
    elementosH1.forEach(function(elemento) {
        if (elemento.textContent.trim() !== "") {
            descricao = elemento.textContent.trim();
            return; // Saia do loop após encontrar o texto desejado
        }
    });

console.log(descricao);


  todosElementos.forEach(elemento => {
    // Obtém o texto dentro do elemento <span>
    const texto = elemento.textContent.trim();
    // Verifica se o texto começa com "SDERP-" e atribui à variável chamado se verdadeiro
    texto.startsWith('SDERP-') ? chamado = elemento.innerText : null;
  });
  const setor = setorElement ? setorElement.innerText.trim().substring(0, 5).toUpperCase().replace(' ', '') : '';

  return { setor, chamado, descricao};
}


function removerAcentosECaracteresEspeciais(string) {
  const mapaAcentosHex = {
    a: /[\xE0-\xE6]/g,
    e: /[\xE8-\xEB]/g,
    i: /[\xEC-\xEF]/g,
    o: /[\xF2-\xF6]/g,
    u: /[\xF9-\xFC]/g,
    c: /\xE7/g,
    n: /\xF1/g,
    A: /[\xC0-\xC6]/g,
    E: /[\xC8-\xCB]/g,
    I: /[\xCC-\xCF]/g,
    O: /[\xD2-\xD6]/g,
    U: /[\xD9-\xDC]/g,
    C: /\xC7/g,
    N: /\xD1/g
  };

  for (let letra in mapaAcentosHex) {
    const expressaoRegular = mapaAcentosHex[letra];
    string = string.replace(expressaoRegular, letra);
  }

  string = string.replace(/[^a-zA-Z0-9]/g, '');
  string = string.toUpperCase(); 
  return string;
}


