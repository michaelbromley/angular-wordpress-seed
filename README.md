# angular-wordpress-seed

A bare-bones AngularJS blog app designed to work with the Wordpress JSON REST API.

## Setting Up Wordpress

1. Download and install Wordpress ([Download link](https://wordpress.org/download/))
2. Enable pretty permalinks (`Settings -> Permalinks`), select "custom structure" and use the string `/%post_id%/%postname%`.
3. Install the **JSON REST API (WP-API)** plugin. Easiest way is to use the `Plugins -> Add New` feature of the Wordpress
admin interface. Manual install instructions can be found on the [WP-API repo](https://github.com/WP-API/WP-API#installation).
4. By default, the [AngularJS service that communicates with Wordpress](src/app/common/services/BlogService.js) will look for posts with a category of "post". Additionally,
posts which are also in the category "featured" will appear on the home page. These categories will therefore need to be set up.

## Setting Up The Client

1. Clone this repo.
2. Run `npm install` and `bower install` to download the dependencies.
3. Configure your paths and meta data in the `config.json` file of the root directory.
3. Run `gulp watch` to build and start the watch task.
4. Navigate to the `/build` directory in your browser to test.
5. Upload the contents of `/dist` to your production server.

## Features

* Simple, responsive CSS based on the [Pure CSS framework](http://purecss.io/).
* A couple of custom directives are included for simple pagination of blog posts and a revealing search input.
* Built-in support for handling search-engine and social-media crawlers based on [this technique](https://github.com/michaelbromley/angular-social-demo)