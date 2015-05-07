module.exports = {
  GLMAT_EPSILON: 0.000001,
  GLMAT_RANDOM: Math.random,
  GLMAT_ARRAY_TYPE: (typeof Float32Array !== 'undefined') ? Float32Array : Array
};