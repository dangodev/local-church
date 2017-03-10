/**
 * Keywords
 * Match inputs against keywords
 */

module.exports = (text, keywords) => {
  if (typeof text !== 'string' || typeof keywords !== 'object') {
    return false;
  }
  const textLower = text.toLowerCase();
  return keywords
    .filter(keyword => textLower.indexOf(keyword.toLowerCase()) !== -1)
    .length !== 0;
};
