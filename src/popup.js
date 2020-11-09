const generateHeader = (operations = []) => {
  const container = document.getElementById('autochecker-results');
  const headerElement = document.createElement('h3');
  let headerText;
  if (operations.length === 1) {
    headerText = document.createTextNode('1 checkbox detected on this page.');
  } else {
    headerText = document.createTextNode(`${operations.length} checkboxes detected on this page.`);
  }
  headerElement.appendChild(headerText);
  headerElement.appendChild(document.createElement('hr'));
  container.appendChild(headerElement);
};

const generateCheckboxInfo = (operations = []) => {
  const container = document.getElementById('autochecker-results');
  if (operations.length) {
    operations.forEach((operation) => {
      const labelTextElement = document.createElement('p');
      // add an italics element for displaying the label text of the checkbox
      const italicsElement = document.createElement('i');
      const boldElement = document.createElement('b');
      const actionText = document.createTextNode(`${operation.action}: `);
      boldElement.appendChild(actionText);
      italicsElement.appendChild(boldElement);
      const labelText = document.createTextNode(`"${operation.text}"`);
      italicsElement.appendChild(labelText);
      labelTextElement.appendChild(italicsElement);
      container.appendChild(labelTextElement);
      // now add the message from auto-checker
      const infoElement = document.createElement('p');
      const infoText = document.createTextNode(`The above text (${operation.checkboxId}) was identified as ${operation.category}. \
The checkbox has been ${operation.action}.`);
      infoElement.appendChild(infoText);
      container.appendChild(infoElement);
      container.appendChild(document.createElement('hr'));
    });
  } else {
    const infoContainer = document.createElement('p');
    const infoText = document.createTextNode('Autochecker was unable to find any checkboxes.');
    infoContainer.appendChild(infoText);
    container.appendChild(infoContainer);
  }
};

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  const { url } = tabs[0];
  chrome.storage.sync.get([url], (data) => {
    generateHeader(data[url]);
    generateCheckboxInfo(data[url]);
  });
});
