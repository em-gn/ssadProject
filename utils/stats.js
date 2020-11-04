//this utility function was copied from https://gist.github.com/Daniel-Hug/7273430
const arr = {
  getPercentile: function (data, percentile) {
    data.sort(arr.numSort);
    var index = (percentile / 100) * data.length;
    var result;
    if (Math.floor(index) == index) {
      result = (data[index - 1] + data[index]) / 2;
    } else {
      result = data[Math.floor(index)];
    }
    if (!result) return 0;
    return result;
  },
  numSort: function (a, b) {
    return a - b;
  },
  max: function (array) {
    return Math.max.apply(null, array);
  },

  min: function (array) {
    return Math.min.apply(null, array);
  },

  range: function (array) {
    return arr.max(array) - arr.min(array);
  },

  midrange: function (array) {
    return arr.range(array) / 2;
  },

  sum: function (array) {
    var num = 0;
    for (var i = 0, l = array.length; i < l; i++) num += array[i];
    return num;
  },

  mean: function (array) {
    return arr.sum(array) / array.length;
  },

  median: function (array) {
    array.sort(function (a, b) {
      return a - b;
    });
    var mid = array.length / 2;
    return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
  },

  modes: function (array) {
    if (!array.length) return [];
    var modeMap = {},
      maxCount = 0,
      modes = [];

    array.forEach(function (val) {
      if (!modeMap[val]) modeMap[val] = 1;
      else modeMap[val]++;

      if (modeMap[val] > maxCount) {
        modes = [val];
        maxCount = modeMap[val];
      } else if (modeMap[val] === maxCount) {
        modes.push(val);
        maxCount = modeMap[val];
      }
    });
    return modes;
  },

  variance: function (array) {
    var mean = arr.mean(array);
    return arr.mean(
      array.map(function (num) {
        return Math.pow(num - mean, 2);
      })
    );
  },

  standardDeviation: function (array) {
    return Math.sqrt(arr.variance(array));
  },

  meanAbsoluteDeviation: function (array) {
    var mean = arr.mean(array);
    return arr.mean(
      array.map(function (num) {
        return Math.abs(num - mean);
      })
    );
  },

  zScores: function (array) {
    var mean = arr.mean(array);
    var standardDeviation = arr.standardDeviation(array);
    return array.map(function (num) {
      return (num - mean) / standardDeviation;
    });
  },
};

module.exports = arr;
