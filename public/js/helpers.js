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

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('-');
};