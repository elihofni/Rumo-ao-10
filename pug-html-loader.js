/**
 * This plugin was copied from https://github.com/willyelm/pug-html-loader/pull/50
 * The pug-html-loader has not been updated in the last years, so it was better to
 * copy the loader with the fix to the project insted of waiting for an official
 * solution, or using a forked repository
 */

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Williams Medina @willyelm
*/

/* eslint-disable */
'use strict';
const util = require('loader-utils');
const pug = require('pug/lib');

let cachedDeps;

module.exports = function(source) {
  let query = {};
  if (this.cacheable) {
    this.cacheable(true);
  }
  if (typeof this.query === 'string') {
    query = util.parseQuery(this.query);
  } else {
    query = this.query;
  }
  let req = util.getRemainingRequest(this);
  let options = Object.assign(
    {
      filename: this.resourcePath,
      doctype: query.doctype || 'js',
      compileDebug: this.debug || false,
    },
    query
  );
  if (options.plugins) {
    if (!(options.plugins instanceof Array)) {
      options.plugins = [options.plugins];
    }
  }
  let template;
  try {
    template = pug.compile(source, options);
  } catch (ex) {
    cachedDeps.forEach(this.addDependency);
    this.callback(ex);
    return;
  }
  cachedDeps = template.dependencies
    ? template.dependencies.slice()
    : undefined;
  template.dependencies.forEach(this.addDependency);
  let data = query.presets || {};
  return template(data);
};

/* eslint-enable */
