/*jshint node:true */

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: "../",


    // frameworks to use
    frameworks: ["jasmine"],


    // list of files / patterns to load in the browser
    files: [
      "node_modules/jquery/dist/jquery.js",
      "node_modules/jasmine-jquery/lib/jasmine-jquery.js",
      "node_modules/jquery-simulate-ext/libs/jquery.simulate.js",

      "tests/bootstrap.js",
      { pattern: "tests/fixtures/**/*.html", included: false },

      "tests/specs/**/*.spec.js",
      "sources/classes/*.js"
    ],


    // list of files to exclude
    exclude: [
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ["progress"],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ["PhantomJS"],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,


    // Disable preprocessor to be able to serve HTML files, see:
    // https://github.com/karma-runner/karma/issues/740#issuecomment-24942822
    preprocessors: {}
  });
};
