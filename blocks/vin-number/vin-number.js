import { getTextLabel, createElement, getJsonFromUrl } from '../../scripts/scripts.js';

const VIN_URL = 'https://vinlookup-dev-euw-ase-01.azurewebsites.net/v1/api/vin/';
const API_KEY = '0e13506b59674706ad9bae72d94fc83c';

const docRange = document.createRange();
const isFrench = window.location.origin.indexOf('fr') > -1;

// list of things to be display for each recall
const valueDisplayList = [{
  key: 'recall_date',
},
{
  key: 'mfr_recall_status',
},
{
  key: 'recall_description',
  frenchKey: 'recall_description_french',
}, {
  key: 'safety_risk_description',
  frenchKey: 'safety_risk_description_french',
}, {
  key: 'remedy_description',
  frenchKey: 'remedy_description_french',
}, {
  key: 'mfr_notes',
}];

// use this to map values from API
const recallStatus = {
  11: 'recall_incomplete',
  0: 'recall_complete',
  12: 'recall_incomplete_no_remedy',
};

function renderRecalls(recallsData) {
  const resultText = document.querySelector('.vin-number__results-text');
  resultText.innerText = getTextLabel('result text').replace(/\${count}/, recallsData.number_of_recalls).replace(/\${vin}/, recallsData.vin);

  if (recallsData.recalls_available) {
    const blockEl = document.querySelector('.vin-number__recalls-wrapper');
    const listWrapperFragment = docRange.createContextualFragment(`
      <span class="vin-number__recalls-heading"> 
        <h4>${getTextLabel('recalls')}  &nbsp; &nbsp;</h4>
        <span> [Information last updated: ${recallsData.refresh_date}] </span>
      </span>
    `);

    // create each recall
    const list = createElement('ul', 'vin-number__list');
    recallsData.recalls.forEach((recall) => {
      const liEl = createElement('li', 'vin-number__list-item');

      // map the number from api to correct status
      recall.mfr_recall_status = recallStatus[recall.mfr_recall_status];

      valueDisplayList.forEach((item) => {
        const recallClass = item.key === 'mfr_recall_status' ? `vin-number__${recall.mfr_recall_status.replace(/ /g, '-').toLowerCase()}` : '';
        if (recallClass) {
          recall[item.key] = getTextLabel(recall[item.key]);
        }
        const itemFragment = docRange.createContextualFragment(`
          <div class="vin-number__item-title subtitle-1"> ${getTextLabel(item.key)} </div>
          <div class="vin-number__item-value ${recallClass}">${item.frenchKey && isFrench ? recall[item.frenchKey] : recall[item.key]}</div>
        `);
        liEl.append(...itemFragment.children);
      });
      list.append(liEl);
    });

    blockEl.append(listWrapperFragment);
    blockEl.appendChild(list);
  }
}

async function fetchRecalls(e) {
  e.preventDefault();
  if (e && e.target) {
    // disable submit while fetching data
    const submitBtn = e.target.querySelector('button');
    submitBtn.disabled = true;

    const recalls = document.querySelector('.vin-number__recalls-wrapper');
    recalls.innerHTML = '';

    const resultText = document.querySelector('.vin-number__results-text');
    resultText.innerText = getTextLabel('loading recalls');

    const formData = new FormData(e.target);
    const vin = formData.get('vin');

    if (vin) {
      try {
        getJsonFromUrl(`${VIN_URL}${vin}?api_key=${API_KEY}&mode=company`)
          .then((response) => {
            if (response.error_code) {
              resultText.innerHTML = `${getTextLabel('no recalls')} ${vin}`;
            } else {
              renderRecalls(response);
            }

            const vinInput = document.querySelector('.vin-number__input');
            vinInput.value = '';
            submitBtn.disabled = false;
          });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching Recalls:', error);
      }
      return null;
    }
  }
  return null;
}

export default async function decorate(block) {
  const form = createElement('form', 'vin-number__form');
  const formChildren = document.createRange().createContextualFragment(`
    <div class="vin-number__input-wrapper">
      <input
        type="text"
        name="vin"
        id="vin_number"
        autocomplete="off"
        placeholder=" "
        minlength="17"
        maxlength="17"
        required
        class="vin-number__input"
        pattern="^[2][V,v,N,n,P,p][1,2,4,5,C,c,V,v,][B-C,E-H,J-N,R-S,V-Y,b-c,e-h,j-n,r-s,v-y][A-Za-z0-9]{13}$"
      />
      <label for="vin_number" class="vin-number__label">${getTextLabel('vinlabel')}</label>
    </div>
    <button class="button primary vin-number__submit" type="submit" name="submit">${getTextLabel('submit')}</button>
  `);

  const vinResultsContainer = createElement('div', 'vin-number__results-container');
  const innerContent = docRange.createContextualFragment(`
    <span class="vin-number__results-text"></span>
    <div class="vin-number__recalls-wrapper"></div>
  `);

  vinResultsContainer.append(innerContent);

  form.addEventListener('submit', fetchRecalls, false);
  form.append(...formChildren.children);
  block.append(form);
  block.append(vinResultsContainer);

  const vinInput = block.querySelector('.vin-number__input');

  vinInput.oninvalid = (e) => {
    e.target.setCustomValidity(getTextLabel('vinformat'));
  };

  vinInput.oninput = (e) => {
    e.target.setCustomValidity('');
  };
}
