import { decode } from 'html-entities';

export const replaceHTML = (string) => {
  const newString = decode(
    string
      .replace('<p>', '')
      .replace('</p>', '')
      .replace('<strong>', '')
      .replace('</strong>', '')
  );
  return newString;
};

const helpers = { replaceHTML };

export default helpers;
