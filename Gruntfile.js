/* jshint camelcase: false */
'use strict';

// # Globbing
// only match one level down for performance reasons:
//   'test/spec/{,*/}*.js'
// to recursively match all subfolders:
//   'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        bowerComp: '../bower-angular-ice',
        ghPages: '../angular-ice-pages',
        packageBaseName: 'angular-ice',
        getFilesJs: function() {
            return [
                '<%= yeoman.app %>/**/*.js',
                '!<%= yeoman.app %>/**/*_test.js',
                '!<%= yeoman.app %>/**/*_mock.js',
                '!<%= yeoman.app %>/**/*_e2e.js',
                '!<%= yeoman.app %>/bower_components/**/*.js'
            ];
        },
        getFilesJsHint: function() {
            var filesJsHint = appConfig.getFilesJs();
            filesJsHint.push('Gruntfile.js');
            return filesJsHint;
        },
        getFilesJsTest: function() {
            return [
                '<%= yeoman.app %>/**/*_test.js',
                '<%= yeoman.app %>/**/*_mock.js',
                '<%= yeoman.app %>/**/*_e2e.js',
                '!<%= yeoman.app %>/bower_components/**/*.js'
            ];
        }
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: appConfig.getFilesJs(),
                tasks: ['newer:jshint:all', 'karma:unit'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            jsTest: {
                files: appConfig.getFilesJsTest(),
                tasks: ['newer:jshint:test', 'karma:unit']
            },
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['newer:jshint:all']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/**/*.html'
                ]
            }
        },

        // Empties folders to start fresh
        clean: {
            tmp: '.tmp'
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729,
                base: [
                    '<%= yeoman.app %>'
                ]
            },
            livereload: {
                options: {
                    open: true
                }
            },
            test: {
                options: {
                    port: 9001
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: 'conf/.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: appConfig.getFilesJsHint()
            },
            test: {
                options: {
                    jshintrc: 'conf/.jshintrc_test'
                },
                src: appConfig.getFilesJsTest()
            }
        },

        // Test settings
        karma: {
            options: {
                configFile: 'conf/karma.conf.js',
                singleRun: true
            },
            unit: {
                browsers: ['PhantomJS']
            },
            unitAllBrowsers: {
                browsers: ['Chrome', 'Firefox']
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                ignorePath:  /\.\.\//
            }
        },

        dom_munger: {
            read: {
                options: {
                    read: [
                        {selector: 'script[data-concat!="false"]', attribute: 'src', writeto: 'componentJsFiles', isPath: true}
                    ]
                },
                src: '<%= yeoman.app %>/index.html'
            }
        },

        // banner: This string will be prepended to the beginning of the concatenated output.
        // footer: This string will be appended to the end of the concatenated output.
        // process: Process source files using the given function, called once for each file. The returned value will be used as source code.
        concat: {
            componentJsFiles: {
                options: {
                    banner: '(function() {\n\'use strict\';\n',
                    footer: '\n})();',
                    process: function(src) {
                        return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    }
                },
                src: ['<%= dom_munger.data.componentJsFiles %>', '!<%= yeoman.app %>/bower_components/**/*.js'],
                dest: '.tmp/<%= yeoman.packageBaseName %>.js'
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            componentJsFiles: {
                files: {
                    '<%= yeoman.bowerComp %>/<%= yeoman.packageBaseName %>.js': ['.tmp/<%= yeoman.packageBaseName %>.js']
                }
            }
        },

        uglify: {
            componentJsFiles: {
                src: '<%= yeoman.bowerComp %>/<%= yeoman.packageBaseName %>.js',
                dest: '<%= yeoman.bowerComp %>/<%= yeoman.packageBaseName %>.min.js'
            }
        },

        copy: {
            bowerComponentsToGhPages: {
                expand: true,
                cwd: '<%= yeoman.app %>/bower_components/',
                src: '**/*',
                dest: '<%= yeoman.ghPages %>/bower_components/'
            },
            concatenatedComponentJsToGhPages: {
                expand: true,
                cwd: '<%= yeoman.bowerComp %>/',
                src: '<%= yeoman.packageBaseName %>.js',
                dest: '<%= yeoman.ghPages %>/bower_components/angular-ice/'
            },
            appToGhPages: {
                expand: true,
                cwd: '<%= yeoman.app %>/',
                src: 'app.*',
                dest: '<%= yeoman.ghPages %>/'
            },
            examplesToGhPages: {
                expand: true,
                cwd: '<%= yeoman.app %>/examples/',
                src: '*',
                dest: '<%= yeoman.ghPages %>/examples/'
            },
            testHelperToBowerComponent: {
                expand: true,
                cwd: '<%= yeoman.app %>/components/icetest/',
                src: 'ice-test-helper_test.js',
                dest: '<%= yeoman.bowerComp %>/',
                rename: function(dest) {
                    return dest + '<%= yeoman.packageBaseName %>.testHelper.js';
                }
            }
        }
    });

    grunt.registerTask('default', [
        'jshint',
        'karma:unit'
    ]);

    grunt.registerTask('test', [
        'jshint',
        'connect:test',
        'karma:unitAllBrowsers'
    ]);

    grunt.registerTask('serve', [
        'wiredep',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean:tmp',
        'wiredep',
        'dom_munger',
        'concat',
        'ngAnnotate',
        'uglify',
        'copy'
    ]);
};
