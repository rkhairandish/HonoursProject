module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      dist: {
        files: {
          'javascripts/create-graph.js': ['not-browserified/test.js']
        }
      }
    },
    exec: {
      browserify: 'browserify not-browserified/create-graph.js -o javascripts/create-graph.js'
    },
    watch: {
      scripts: {
        files: ['not-browserified/*.js'],
        tasks: ['exec']
      },
    },

  });
    // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-exec');

  // Default task(s).
  grunt.registerTask('default', ['watch']);

};