const conditions = ['terms', 'policy', 'prvacy', 'privacy'];
const marketing = ['marketing', 'receive', 'send me', 'email', 'sms', 'news', 'updates', 'offer'];
const optOut = ['do not', 'don\'t'];

const isTermsAndConditions = text => typeof text === 'string' && conditions.some(term => text.includes(term));
const isMarketingRelated = text => typeof text === 'string' && marketing.some(term => text.includes(term));
const isOptOut = text => typeof text === 'string' && optOut.some(term => text.includes(term));

/*
recieves label text and attempts to decide whether checkbox
should be checked or unchecked, as well as what category the checkbox is
returns an object structured like so:
{
  action: ('checked', 'unchecked', 'ignored'),
  category: ('marketing', 'terms and conditions', 'unknown')
}
*/
const determineOperation = (text) => {
  if (typeof text !== 'string') {
    return null;
  }

  let action = '';
  let category = '';
  if (isTermsAndConditions(text)) {
    action = 'checked';
    category = 'terms and conditions';
    if (isOptOut(text)) {
      action = 'unchecked';
    }
    return { action, category };
  }
  if (isMarketingRelated(text)) {
    action = 'unchecked';
    category = 'marketing';
    if (isOptOut(text)) {
      action = 'checked';
    }
    return { action, category };
  }
  return {
    action: 'ignored',
    category: 'unrelated/unknown',
  };
};

function findCheckboxes() {
  const operations = [];
  // find all inputs of type checkbox on the page
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  // for every checkbox on the page
  checkboxes.forEach((checkbox) => {
    // attempt to find text for the checkbox
    let label = null;
    let labelText = '';
    // try finding a label with a 'for' attribute of this checkbox
    if (checkbox.labels.length) {
      // great, the html is made properly and the label has the text in it
      labelText = checkbox.labels[0].innerText;
    } else {
      // search sibling elements
      label = document.querySelector(`label[for="${checkbox.id}"]`);
      if (label) {
        labelText = label.innerText;
      }
    }

    if (labelText === '') {
      let sibling = checkbox.nextElementSibling;
      while(sibling) {
        let text = sibling.innerText;
        if (determineOperation(text).action !== 'ignored') {
          labelText = text;
          break;
        }
      }
    }

    // Last shot
    if (labelText === '') {
      labelText = checkbox.parentNode.innerText;
    }

    const operation = determineOperation(labelText.toLowerCase());

    if (operation.action === 'checked') {
      // eslint-disable-next-line no-param-reassign
      checkbox.checked = true;
      checkbox.style.outline = "thick solid #55FF55"
    } else if (operation.action === 'unchecked') {
      // eslint-disable-next-line no-param-reassign
      checkbox.checked = false;
      checkbox.style.outline = "thick solid #FF5555"
    }
    operations.push({
      checkboxId: checkbox.id,
      text: labelText,
      action: operation.action,
      category: operation.category,
    });
  });

  if (operations.length === 0) {
      console.log("found none");
    return false;
  }

  chrome.runtime.sendMessage({
    operations,
  });
  return true;
}

if (!findCheckboxes()) {
  // Probably not created yet, try again later
  setTimeout(() => {
    findCheckboxes();
  }, 2500);
}

//export { isTermsAndConditions, isMarketingRelated, isOptOut, determineOperation };
