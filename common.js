module.exports = {
  GLMAT_EPSILON: function() { return 0.000001; },
  GLMAT_RANDOM: function() { return Math.random; },
  GLMAT_ARRAY_TYPE: function() { return (typeof Float32Array !== 'undefined') ? Float32Array : Array; }
};