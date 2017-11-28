require.config({
    baseUrl: "js",
    paths: {
        "jQuery": "lib/jQuery/dist/jquery.min",
        "knockout": "lib/knockout/dist/knockout"
    }
});

require(["knockout", "jQuery"], function(ko, jQuery) {

    (function () {

        var vm = {
            title: ko.observable("Hello from Knockout"),
            firstName: ko.observable("Peter"),
            lastName: ko.observable("Smith"),
            names: ko.observableArray(["peter", "joe"]),

            changeTitle: function () {
                console.log(this.title);
                this.title("Changed");
            },

            addName: function (name) {
                this.names.push(name.fullName());
                this.firstName("");
                this.lastName("");
            }
        };

        vm.fullName = ko.computed(function () {
            return this.firstName() + " " + this.lastName();
        }, vm);

        ko.applyBindings(vm);


    })();
})