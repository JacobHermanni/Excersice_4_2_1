require.config({
    baseUrl: "js",
    paths: {
        "jQuery": "lib/jQuery/dist/jquery.min",
        "knockout": "lib/knockout/dist/knockout",
        "text": "lib/text/text",
        "broadcaster": "services/broadcaster"
    }
});

function test() {
    console.log("works");
}

require(['knockout'], function (ko) {

    ko.components.register("all-posts", {
        viewModel: { require: "components/posts/posts" },
        template: { require: "text!components/posts/posts_view.html"}
    });

    ko.components.register("single-post", {
        viewModel: { require: "components/singlePost/single-post" },
        template: { require: "text!components/singlePost/single-post_view.html"}
    });


});


require(["knockout", "jQuery", "broadcaster"], function(ko, jQuery, broadcaster) {
    (function () {

         fetchData = function(url, callback) {
            $.getJSON(url, function(data) {
                    console.log("fetched Data:", data);
                    callback(data);
            });
         }

         var vm = (function() {
            var posts = ko.observableArray([]);
            var prev = ko.string;
            var next = ko.string;
            var displayPrev = ko.observable(false);
            var displayNext = ko.observable(false);

            // ------------ Search Function: ------------ //
            var search = function() {

                fetchData(window.location + "api/posts", data => {
                    posts.removeAll();
                    for (i = 0; i < data.items.length; i++) {
                        posts.push(data.items[i]);
                    }
                    next = data.next;
                    prev = data.prev;
                    navPage();
                });
            }

            // ------------ Page Navigation: ------------ //
            var navPage = function(data) {
                next === null ? displayNext(false) : displayNext(true);
                prev === null ? displayPrev(false) : displayPrev(true);
            }

            var nextPage = function() {
                console.log("pressed next");
                fetchData(next, data => {
                    posts.removeAll();
                    for (i = 0; i < data.items.length; i++) {
                        posts.push(data.items[i]);
                    }
                    next = data.next;
                    prev = data.prev;
                    navPage();
                });
            }

            var prevPage = function() {
                console.log("pressed prev");
                fetchData(prev, data => {
                    posts.removeAll();
                    for (i = 0; i < data.items.length; i++) {
                        posts.push(data.items[i]);
                    }
                    next = data.next;
                    prev = data.prev;
                    navPage();
                });
            }

            var postTitle = ko.observable();
            var creationDate = ko.observable();
            var score = ko.observable();
            var body = ko.observable();


            // ------------ Get individual post: ------------ //
            var getPost = function() {
                fetchData(this.link, data => {
                    postTitle(data.title);
                    creationDate(data.creationDate);
                    score(data.score);
                    body(data.body);
                    getAnswers(data.answers);
                    console.log("data fra getPost:", data);
                });
                toggle();
            }

            var answers = ko.observableArray([]);

            var getAnswers = function(url) {
                console.log("Answers", url);
                fetchData(url, data => {
                    console.log("fra getANSWERS:::", data);
                    for (i = 0; i < data.length; i++) {
                        answers.push(data[i]);
                        console.log(data[i]);
                    }

                });
            }

            // ------------ Template switching: ------------ //
            var template = ko.observable("posts-template");

            var getTemplate = function(data) {
                return data.template();
            }

            var toggle = function() {
                template(template() === "posts-template" ? "post-template" : "posts-template");    
            }

            var currentView = ko.observable('all-posts');
            var currentParams = ko.observable("");

            var switchComponent = function() {
                if (currentView() === "all-posts") {
                    currentView("single-post");
                } else {
                    currentView("all-posts");
                }

            }

            broadcaster.subscribe(broadcaster.events.changeView,
            viewName => {
                currentView(viewName);
                console.log("what is this:", viewName);
                currentParams("test currentParams");
                console.log("fsdælasdælsakdæl", currentParams());
            });

            return {
                posts,
                prev,
                next,
                displayPrev,
                displayNext,
                template,
                search,
                getTemplate,
                toggle,
                nextPage,
                prevPage,
                navPage,
                getPost,
                getAnswers,
                answers,
                postTitle,
                creationDate,
                score,
                body,
                currentView,
                switchComponent,
                currentParams
            }

          })();


         ko.applyBindings(vm);


    })();
})