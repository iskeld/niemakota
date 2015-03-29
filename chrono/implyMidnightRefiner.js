var Refiner = require('chrono-node').Refiner;

exports.Refiner = function ImplyMidnightRefiner() {
    Refiner.call(this);    
    this.refine = function(text, results, opt) {
        results.forEach(function(result) {
        result.start.imply('hour', 0);
            if (result.end) {
                result.end.imply('hour', 0);
            }
        });
        return results;
    };
};