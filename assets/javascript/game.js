function readFile(file) {
    return fetch(file).then(function (response) {
        return response.text();
    });
}

function getRandCommand() {
    var words = readFile('assets/json/commands.json');

    return words.then(function(text) {
        var wordObj = JSON.parse(text);
        var i = Math.floor(Math.random() * wordObj.length);
        return wordObj[i];
    });
}

var command = getRandCommand();
command.then(function (item) {
    console.log("Command: ", item.command);
    console.log("Description: ", item.description);
});
