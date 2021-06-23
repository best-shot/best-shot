'use strict';

exports.notEmpty = function notEmpty(object) {
  return object && Object.values(object).some((item) => item !== undefined);
};
