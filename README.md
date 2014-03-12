# grunt-expire-images

## Getting Started
This plugin requires Grunt `~0.4.3`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-expire-images --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-expire-images');
```

## The "expire_images" task

### Overview
In your project's Gruntfile, add a section named `expire_images` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  expire_assets: {
    files: {
      options: {
        cachedir: './cache', // relative /node_modules/grunt-expire-assets/
        basedir: 'app/webroot' //relative to Gruntfile
      },

      //Location of assets to check
      src: [
        'css/images/**/*.png',
        'css/images/**/*.gif',
        'css/images/**/*.jpg',
        'css/images/**/*.jpeg',
        'theme/fonts/*'
      ],

      //Location of assets to rewrite with timestamps
      dest: [
        '**/*.css',
        '**/*.js',
        '../views/**/*.ctp',
        '../views/**/*.php'
      ]
    }
  }
});
```