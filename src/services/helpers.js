export const replaceHTML = (string) => {
  const newString = string
    .replace('<p>', '')
    .replace('</p>', '')
    .replace('<strong>', '')
    .replace('</strong>', '');

  return newString;
};

const helpers = { replaceHTML };

export default helpers;
