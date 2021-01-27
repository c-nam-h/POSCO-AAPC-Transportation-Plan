module.exports = function() {
    this.compare_date = function(a, b) {
      if (a.ETA < b.ETA) {
        return -1;
      } else if (a.ETA > b.ETA) {
        return 1;
      } else {
        return 0;
      };
    };
}