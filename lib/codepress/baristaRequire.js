var _ = require("lodash");

module.exports.defaultRequireWhitelist = [
    //Built-ins
    'buffer',
    'cluster',
    'crypto',
    'dns',
    'errors',
    'events',
    'http',
    'https',
    'os',
    'path',
    'punycode',
    'querystring',
    'stream',
    'string_decoder',
    'url',
    'util',
    'zlib',

    //Third-party
    'async',
    'csso',
    'edge',
    'edge-cs',
    'handlebars',
    'linq',
    'lodash',
    'moment',
    'q',
    'uglify-js'
];

module.exports.requireWhitelist = module.exports.defaultRequireWhitelist;

//Define the userland require remap
module.exports.require =  function(id) {
    if (_.includes(module.exports.requireWhitelist, id)) {
        return require(id);
    }
    
    if (id === "barista-context") {
        return baristaContext;
    }
    
    ////Define the packages that was there previously.
    //if (id === "SharePoint") {
    //    return require("./../lib/SharePoint_v1.js")(baristaContext);
    //}
    
    //return require("./../lib/SharePoint_Require_v1.js")(_.cloneDeep(sandbox), baristaContext, id);
};