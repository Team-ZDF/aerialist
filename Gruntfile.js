module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    exec: {
      run: "node_modules\\electron-prebuilt\\dist\\electron.exe .\\"
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-exec');

  // Default task(s).
  grunt.registerTask('default', ['exec:run']);

};
