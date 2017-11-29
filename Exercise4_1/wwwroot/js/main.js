require.config({
    baseUrl: "js",
    paths: {
        "jQuery": "lib/jQuery/dist/jquery.min",
        "knockout": "lib/knockout/dist/knockout"
    }
});

function test() {
    console.log("works");
}


require(["knockout", "jQuery"], function(ko, jQuery) {
    (function () {

         function DataService() {

            this.getPosts = function(callback) {
                $.getJSON("http://localhost:64167/" + "api/posts", function(data) {
                    console.log("GetPosts Data:", data);
                    callback(data);
                });
            }

            this.changePage = function(chg, callback) {
                $.getJSON(chg, function(data) {
                    console.log("nextPageData:", data);
                    callback(data);
                });
            }
         }


         var vm = {

            dataService: new DataService(),
            posts: ko.observableArray([]),
            prev: ko.string,
            next: ko.string,
            displayPrev: ko.observable(false),
            displayNext: ko.observable(false),

            search: function() {
                this.dataService.getPosts(data => {
                    this.posts.removeAll();
                    for (i = 0; i < data.items.length; i++) {
                        this.posts.push(data.items[i]);
                    }
                    this.next = data.next;
                    this.prev = data.prev;
                    this.navPage();
                });

            },

            nextPage: function() {
                console.log("pressed next");
                this.dataService.changePage(this.next, data => {
                    this.posts.removeAll();
                    for (i = 0; i < data.items.length; i++) {
                        this.posts.push(data.items[i]);
                    }
                    this.next = data.next;
                    this.prev = data.prev;
                    this.navPage();
                });
            },

            prevPage: function() {
                this.dataService.changePage(this.prev, data => {
                    this.posts.removeAll();
                    for (i = 0; i < data.items.length; i++) {
                        this.posts.push(data.items[i]);
                    }
                    this.next = data.next;
                    this.prev = data.prev;
                    this.navPage();
                });
            },

            navPage: function() {
                this.next === null ? this.displayNext(false) : this.displayNext(true);
                this.prev === null ? this.displayPrev(false) : this.displayPrev(true);
            }


         };


         ko.applyBindings(vm);


    })();
})