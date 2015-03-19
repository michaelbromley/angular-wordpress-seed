function BlogService($http, $sce, config) {

    function allPosts() {
        return getData('posts?filter[category_name]=post');
    }

    function allPostsByTag(tag) {
        return getData('posts?filter[category_name]=post&filter[tag]=' + tag);
    }

    function allPostsBySearchTerm(searchTerm) {
        return getData('posts?filter[category_name]=post&filter[s]=' + searchTerm);
    }

    function featuredPosts() {
        return getData('posts?filter[category_name]=post%2Bfeatured');
    }

    function post(id) {
        return getData('posts/' + id);
    }

    function allProjects() {
        return getData('posts?filter[category_name]=project');
    }

    function featuredProjects() {
        return getData('posts?filter[category_name]=project%2Bfeatured');
    }

    function getData(url) {
        return $http
            .get(config.API_URL + url, { cache: true })
            .then(function(response) {
                if (response.data instanceof Array) {
                    var items = response.data.map(function(item) {
                        return decorateResult(item);
                    });
                    return items;
                } else {
                    return decorateResult(response.data);
                }
            });
    }

    /**
     * Decorate a post to make it play nice with AngularJS
     * @param result
     * @returns {*}
     */
    function decorateResult(result) {
        result.excerpt = $sce.trustAsHtml(result.excerpt);
        result.date = Date.parse(result.date);
        result.content = addPermalinkToHeaders(result.content);
        result.content = $sce.trustAsHtml(result.content);
        return result;
    }

    /**
     * Add a dirPermalink directive to any headers within the body of the post.
     * @param content
     * @returns {XML|string|*|void}
     */
    function addPermalinkToHeaders(content) {
        return content.replace(/(<h[234])([^>]*>)/g, '$1 dir-permalink $2');
    }

    return {
        allPosts: allPosts,
        allPostsByTag: allPostsByTag,
        allPostsBySearchTerm: allPostsBySearchTerm,
        featuredPosts: featuredPosts,
        post: post,
        allProjects: allProjects,
        featuredProjects: featuredProjects
    };
}

angular
    .module('app')
    .factory('BlogService', BlogService);