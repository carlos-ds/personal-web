require("dotenv").config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.addNunjucksFilter("date", function (date) {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  });

  return {
    passthroughFileCopy: true,
  };
};
