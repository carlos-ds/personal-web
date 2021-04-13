require('dotenv').config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('assets');

  eleventyConfig.addNunjucksFilter('date', function (date) {
    const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    const month = date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  });

  return {
    passthroughFileCopy: true,
  };
};
