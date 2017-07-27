const fs = require('fs');
const parse = require('csv-parser');
const output = [];
const hey;

hey = 1;

function i18nJSONtoCSV(path, lang) {
  const data = require(path);

  function getKeyValues(key, object) {
    if (typeof object === 'string') {
      output.push(`${key},"${object}"`);
    } else {
      Object.keys(object).forEach(k => getKeyValues(`${key}.${k}`, object[k]));
    }
  }

  Object.keys(data).forEach(key => getKeyValues(key, data[key]));

  let csvData = `key,value\r\n`;
  csvData += output.join(`\r\n`);

  fs.writeFile('data.csv', csvData, 'utf8', (err) => {
    if (err) {
      console.log('Some error occured - file either not saved or corrupted file saved.');
    } else{
      console.log('It\'s saved!');
    }
  });
}

function i18nCSVtoJSON(path, lang) {
  const data = {};

  fs.createReadStream(path)
    .pipe(parse({delimiter: ','}))
    .on('data', (row) => {
      let dataCursor = data;
      const keyArray = row.key.split('.');

      keyArray.forEach((key, index) => {
        if (!dataCursor[key]) {
          if (keyArray.length === index + 1) {
            dataCursor[key] = row[lang];
          } else {
            dataCursor[key] = {};
          }
        }

        dataCursor = dataCursor[key];
      });
    })
    .on('end',function() {
      // console.log(JSON.stringify(data));

      fs.writeFile(`${lang}.i18n.json`, JSON.stringify(data), 'utf8', (err) => {
        if (err) {
          console.log('Some error occured - file either not saved or corrupted file saved.');
        } else{
          console.log('It\'s saved!');
        }
      });
    }
  );
}

i18nCSVtoJSON('./data.csv', 'en');
