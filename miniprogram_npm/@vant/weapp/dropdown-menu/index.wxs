/* eslint-disable */
function displayTitle(item) {
  if (item.title) {
    return item.title;
  }

  var match = item.options.filter(function(option) {
    return option.value === item.value;
  });
  var displayTitle = match.length ? match[0].text : '';
  return displayTitle;
}

module.exports = {
  displayTitle: displayTitle
};
