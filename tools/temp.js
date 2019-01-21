const jsdiff = require('diff');

const one = `
'beep boop'
const a = 1;
`;

const other = `
'beep boob blah'
const a = 2;
`;

const diff = jsdiff.createTwoFilesPatch('test.txt', 'test.js', one, other);

console.log(diff);

// react-code-diff
