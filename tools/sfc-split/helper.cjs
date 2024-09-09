'use strict';

const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { parse } = require('yaml');

function read(base, name) {
  try {
    return readFileSync(resolve(base, name), 'utf8');
  } catch {
    return false;
  }
}

exports.readYAML = function readYAML(base, name) {
  const file =
    read(base, `${name}.yaml`) ||
    read(base, `${name}.yml`) ||
    read(base, `${name}.json`) ||
    {};

  return parse(file);
};

function unique(...arr) {
  return [...new Set(arr)];
}

exports.getAllPages = function getAllPages(config) {
  const {
    entryPagePath,
    pages = [],
    subPackages = [],
    tabBar: { list = [] } = {},
  } = config;

  return unique(
    entryPagePath,
    ...pages,
    ...list.map(({ pagePath }) => pagePath),
    ...subPackages.flatMap(
      (subPackage) =>
        subPackage.pages.map((page) => `${subPackage.root}/${page}`) || [],
    ),
  ).filter(Boolean);
};
