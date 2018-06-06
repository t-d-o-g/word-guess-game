window.onload = function () {
    function readFile(file) {
        return fetch(file).then(function (response) {
            return response.text();
        });
    }

    function getRandCommand() {
        var words = readFile('./assets/json/commands.json');

        return words.then(function(text) {
            var wordObj = JSON.parse(text);
            var i = Math.floor(Math.random() * wordObj.length);
            return wordObj[i];
        });
    }

    function blankWord(word) {
        var underscoreSpans = '';
        for (var i = 0; i < word.length; i++) {
            underscoreSpans += "<span class='letter'>__</span>";
        }
        return underscoreSpans;
    }


    var descriptionEl = document.getElementById('description');
    var commandEl = document.getElementById('command');
    document.addEventListener('keypress', function(evt) {
        var randCommand = getRandCommand();
        randCommand.then(function (item) {
            descriptionEl.innerHTML = item.description;
            // commandEl.innerHTML = item.command;
            commandEl.innerHTML = blankWord(item.command);
        });
    });
    console.log('JS LOADED!');
};