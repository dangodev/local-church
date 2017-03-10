/**
 * Map Values
 * Parses line into values
 */

module.exports = (line, options = { separator: ',' }) => {
  const lineSplit = line.split(options.separator);
  return {
    city: lineSplit[2],
    ein: lineSplit[0],
    name: lineSplit[1],
    state: lineSplit[3],
  };
};
