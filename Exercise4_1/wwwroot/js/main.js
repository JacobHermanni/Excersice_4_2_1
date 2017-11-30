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


         self = this;

         function DataService() {

            this.getPosts = function(callback) {
                $.getJSON(window.location + "api/posts", function(data) {
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

            // ------------ Denne funktion kan ikke kaldes?? har derfor lavet den inde i den fornødne funktion: ------------ //
            this.getPost = function(url, callback) {
                $.getJSON(url, function(data) {
                    console.log("specific post inside:", data);
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
            selectedTemplate: ko.observable(),

            // ------------ Search Function: ------------ //
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

            // ------------ Page Navigation: ------------ //
            navPage: function(data) {
                this.next === null ? this.displayNext(false) : this.displayNext(true);
                this.prev === null ? this.displayPrev(false) : this.displayPrev(true);
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
                console.log("pressed prev");
                this.dataService.changePage(this.prev, data => {
                    for (i = 0; i < data.items.length; i++) {
                        this.posts.push(data.items[i]);
                    }
                    this.next = data.next;
                    this.prev = data.prev;
                    this.navPage();
                });
            },

            postTitle: ko.observable(),
            creationDate: ko.observable(),
            score: ko.observable(),
            body: ko.observable(),
            answersLink: ko.observable(),


            // ------------ Get individual post: ------------ //
            getPost: function() {
                console.log("clicked post with link:", this.link);
                vm.format(this.link);
            },

            format: function(url) {
                this.dataService.getPost(url, data => {
                    this.postTitle(data.title);
                    this.creationDate(data.creationDate);
                    this.score(data.score);
                    this.body(data.body);
                    this.answersLink(data.answers);
                    console.log("fra format - dataService - getpost:", data);
                    this.toggle();
                    this.getAnswers(data.answers);
                });
            },

            answers: ko.observableArray([]),

            getAnswers: function(url) {
                console.log("Answers", url);
                this.dataService.getPost(url, data => {
                    console.log("fra getANSWERS:::", data);
                    for (i = 0; i < data.length; i++) {
                        this.answers.push(data[i]);
                        console.log(data[i]);
                    }

                });
            },


            // ------------ Template switching: ------------ //
            template: ko.observable("posts-template"),

            getTemplate: function(data) {
                return data.template();
            },

            toggle: function() {
                this.template(this.template() === "posts-template" ? "post-template" : "posts-template");    
            }
           

         };





         ko.applyBindings(vm);


    })();
})