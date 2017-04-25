/* jshint node: true */
'use strict';

const TransformFilter = require('./lib/transform-filter');
const fs = require('fs');

module.exports = {
  name: 'ember-form-for',

  included(app) {
    this._super.included.apply(this, arguments);

    const controlsDirectory = `${__dirname}/../../app/templates/components/controls`;
    const controlFileList = fs.readdirSync(controlsDirectory);

    this.options = {
      targets: [
        {
          pattern: 'components/example-component.hbs',
          transform: (content, originalPath) => {
            return buildTemplate(controlFileList);
          }
        }
      ],
      extensions: ['hbs']
    };
  },

  treeForAddonTemplates: function (tree) {
    return new TransformFilter(tree, this.options);
  }
};

function buildTemplate(controlFileList) {
  var hash = controlFileList.reduce((content, controlFileName) => {
    var controlName = controlFileName.slice(0, -4);
    var keyName = controlName.replace('-control', '');

    return `${content} ${keyName}=(component "controls/${controlName}")`;
  }, '');

  return `{{yield (hash ${hash})}}`;
}
