/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';

describe('placeholder.json key presence', () => {
  it('should ensure specific keys are present', async () => {
    const response = await fetch('/placeholder.json');
    expect(response.ok).to.be.true;

    const json = await response.json();

    // Add all the keys you expect to find in placeholder.json
    const keysToCheck = [
      'Low resolution video message',
      'Change cookie settings',
      'No search results',
      'No search results promp',
      'This is 360° image',
      'Close menu',
      'Search',
      'Open menu',
      'Overview',
      'Please enter valid value',
      'no eloqua message',
      'no eloqua link message',
      'vinlabel',
      'vinformat',
      'result text',
      'recalls',
      'recall_date',
      'recall_description',
      'safety_risk_description',
      'remedy_description',
      'published_info',
      'mfr_recall_status',
      'recall-complete',
      'recall-incomplete',
      'recall-incomplete-no-remedy',
      'loading recalls',
      'no recalls',
      'mfr_notes',
      'submit',
      'mfr_recall_number',
      'nhtsa_recall_number',
      'recall_oldest_info',
      'tc_recall_nbr',
      'no-french-info',
      'vinformat-length',
      'day',
      'hour',
      'minute',
      'second',
      'Close',
      'Copied',
      'event-notify:first-name',
      'event-notify:last-name',
      'event-notify:zip',
      'event-notify:email',
      'event-notify:agreement',
      'event-notify:notify',
      'event-notify:add-event',
      'view all',
      'toggle list',
      'view less',
      'recall_available_info',
      'make',
      'model',
      'model year',
      'go to top',
      'single video message title',
      'single video message text',
      'single video message button',
      'single video message button deny',
      'Success newsletter title',
      'Success newsletter text',
    ];

    keysToCheck.forEach((key) => {
      const keyExists = json.data.some((el) => el.Key === key);
      expect(keyExists, `Key "${key}" should be present`).to.be.true;
    });
  });
});
