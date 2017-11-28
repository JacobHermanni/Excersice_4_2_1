require.config({
    baseUrl: "js",
    paths: {
        "jQuery": "lib/jQuery/dist/jquery.min",
        "knockout": "lib/knockout/dist/knockout"
    }
});

require(["knockout", "jQuery"], function(ko, jQuery) {
    (function () {

         function DataService() {

            this.getPosts = function(callback) {
                $.getJSON(window.location.href + "api/posts", function(data) {
                    console.log("getposts", data);
                    callback(data);
                });
            }
         }


         var vm = {

            dataService: new DataService(),
            posts: ko.observableArray([]),

            search: function() {
                this.dataService.getPosts(data => {
                    for (i = 0; i < data.items.length; i++) {
                        this.posts.push(data.items[i]);
                    }
                });
            }


         };


         ko.applyBindings(vm);


    })();
})