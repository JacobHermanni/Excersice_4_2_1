define(['knockout', 'broadcaster'], function(ko, broadcaster) {
    return function (params) {

             fetchData = function(url, callback) {
                $.getJSON(url, function(data) {
                        console.log("fetched Data:", data);
                        callback(data);
                });
             }

             var testFUCK = function() {
                broadcaster.publish(broadcaster.events.changeView, "single-post");
                console.log("triggered");
             };

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

            // ------------ Get individual post: ------------ //
            var getPost = function() {
                
                console.log("clicked single post with link", this.link);
                testFUCK();
            }

            return {
                posts,
                prev,
                next,
                displayPrev,
                displayNext,
                search,
                nextPage,
                prevPage,
                navPage,
                getPost,
                testFUCK
            };

    }
});