import { unwrapDivs } from '../../scripts/scripts.js';

// hide buttons for, content if they are from same origin
function hideButtons(buttons) {
  buttons.forEach((element) => {
    element.classList.add('button', 'nhsta-header-langauge-switch');
    const url = element.href;
    const { location: { origin } = {} } = window.location.origin;

    if (origin === url || (((window.location.host.includes('localhost') || window.location.host.includes('hlx.page')) && url === 'https://www.volvotrucks.ca/en-ca'))) {
      element.classList.add('hide');
    }
  });
}

export default async function decorate(block) {
  unwrapDivs(block);
  const anchorTags = block.querySelectorAll('a');
  hideButtons(anchorTags);
}
