module.exports = {
  isRaw(url) {
    const [last] = url.split('/').slice(-1);
    return last && !/\.html?$/.test(last) && /\.\w+$/.test(last);
  },
};
