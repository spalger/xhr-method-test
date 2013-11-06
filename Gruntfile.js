/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    jshint: {
      options: {
        jshintrc: true
      },
      source: {
        src: [
          'Gruntfile.js',
          'lib/**/*.js',
          'test/**/*.js'
        ]
      }
    },
    testling: {
      options: {
        exec: 'open'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-testling');

  // Default task.
  grunt.registerTask('default', ['jshint', 'testling']);

};
