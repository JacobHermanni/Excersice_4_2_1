define(['knockout'], function(ko) {
    return function (params) {

        console.log("params fra singlepost:", params);

        fetchData = function(url, callback) {
            $.getJSON(url, function(data) {
                    console.log("fetched Data:", data);
                    callback(data);
            });
        }

        var postTitle = ko.observable();
        var creationDate = ko.observable();
        var score = ko.observable();
        var body = ko.observable();

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

        return {
            getAnswers,
            answers,
            postTitle,
            creationDate,
            score,
            body
        };

    }
});