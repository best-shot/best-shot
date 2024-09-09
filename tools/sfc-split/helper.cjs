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

exports.readYAML = function readYAML(base = process.cwd()) {
  const file =
    read(base, 'app.yaml') ||
    read(base, 'app.yml') ||
    read(base, 'app.json') ||
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
