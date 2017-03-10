/**
 * Test
 * Grabs first result from google-maps-services
 */

require('dotenv').config();

const fs = require('fs');
const jsonfile = require('jsonfile');
const readline = require('readline');
const path = require('path');

const googleMapsClient = require('@google/maps')
  .createClient({ key: process.env.GOOGLE_MAPS_API_KEY });

const keywordMatch = require('./lib/keywordMatch');
const mapValues = require('./lib/mapValues');

/**
 * @section Config
 */

const filename = '2017-03-09-npo.txt';
const keywords = [
  'church',
];
const CSVSeparator = '|';

/**
 * @section Begin
 */

const churches = [];

const lineReader = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, filename)),
});

const addChurch = (data) => {
  if (churches.findIndex(({ ein }) => ein === data.ein) !== -1) {
    return false;
  }

  const churchData = {
    active: true,
    addressCity: data.city.trim(),
    addressLine1: null,
    addressLine2: null,
    addressPostalCode: null,
    addressState: data.state.toUpperCase().trim(),
    ageMean: null,
    ageMedian: null,
    ein: data.ein.trim(),
    latitude: null,
    longitude: null,
    members: null,
    name: data.name.trim(),
    retentionRatio: null,
    website: null,
  };

  googleMapsClient.places(
    { query: `${churchData.name} ${churchData.addressCity} ${churchData.addressState}` },
    (error, response) => {
      if (error) {
        churches.push(churchData);
      } else {
        churches.push(Object.assign(
          churchData,
          {
            addressLine1: response.vicinity.split(', ')[0],
            latitude: response.geometry.location.lat(),
            longitude: response.geometry.location.lng(),
            name: response.name,
            place_id: response.place_id,
            vicinity: response.geometry.vicinity,
          },
        ));
      }
    });
};

lineReader.on('line', (input) => {
  if (input.length !== 0) {
    const NPO = mapValues(input, { separator: '|' });

    if (keywordMatch(NPO.name, keywords)) {
      addChurch(NPO);
    }
  }
});

lineReader.on('close', () => {
  const data = { created: Date.now(), churches };

  jsonfile.writeFile(
    './data.json',
    data,
    { spaces: 2 },
    error => console.log(error));
});
