require.config({
    baseUrl: "js",
    paths: {
        "jQuery": "lib/jQuery/dist/jquery.min",
        "knockout": "lib/knockout/dist/knockout"
    }
});

require(["knockout", "jQuery"], function(ko, jQuery) {
    (function () {

        var lol = $.getJSON("http://localhost:64167/api/posts", function(data) {
            console.log(data);
            $("#data").text(JSON.stringify(data.items));
        });

        var vm = {

        posts: ko.observableArray([]),
                    
        };


        vm.posts = ko.computed(function() {
            return $.getJSON("http://localhost:64167/api/posts", function(data) 
            {
                return (JSON.stringify(data.items));
            });
        }, vm);


        ko.applyBindings(vm);


    })();
})