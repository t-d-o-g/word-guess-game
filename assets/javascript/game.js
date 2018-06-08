// Read json file with list of commands 
function readFile(file) {
    return fetch(file).then(function (response) {
        return response.text();
    });
}

// Randomly select command from json file
function getRandCommand() {
    var words = readFile('./assets/json/commands.json');

    return words.then(function(text) {
        var wordObj = JSON.parse(text);
        var i = Math.floor(Math.random() * wordObj.length);
        return wordObj[i];
    });
}

// Set underscores in span tags for letters in word
function initWord(word) {
    var underscores = [];
    for (var i = 0; i < word.length; i++) {
        underscores.push("<span class='letter'>_</span>");
    }
    return underscores;
}

function updateWord(letter, word, currWord) {
    var htmlLetter = "<span class='letter'>"+letter+'</span>';
    var updatedWord = [];
    for (var i = 0; i < word.length; i++) {
        if (letter === word[i]) {
            updatedWord.push(htmlLetter);
        } else {
            updatedWord.push(currWord[i]);
        }
    }
    return updatedWord;
}

function youWin(currWord, score, guesses, letters) {
    if (currWord.indexOf("<span class='letter'>_</span>") === -1) {
        messageEl.innerHTML = 'You win.';
        score++;
        guesses
        letters = [];
    }
    return score;
}

var descriptionEl = document.getElementById('description');
var commandEl = document.getElementById('command');
var messageEl = document.getElementById('message');
var scoreEl = document.getElementById('score');
var guessesEl = document.getElementById('guesses');
var lettersEl = document.getElementById('letters');

// Game starts when key is pressed
document.addEventListener('keyup', function(evt) {
    var score = 0;
    var totalGuesses = 10;
    var letters = [];
    var lettersRight = [];
    var lettersWrong = [];
    var randCommand = '';

    if (evt.defaultPrevented) {
        return;
    }

    var startKey = evt.key || evt.keyCode;

    if (startKey === ' ') {
        totalGuesses = 10;
        letters = [];
        lettersRight = [];
        lettersWrong = [];
        randCommand = getRandCommand();

        randCommand.then(function (item) {
            var description = item.description;
            var command = item.command;
            scoreEl.innerHTML = score;
            guessesEl.innerHTML = totalGuesses;
            lettersEl.innerHTML = lettersWrong.join('');
            messageEl.style.display = 'block';
            descriptionEl.innerHTML = description;
            var currentWord = initWord(command);
            commandEl.innerHTML = currentWord.join('');

            document.addEventListener('keyup', function(evt) {
                messageEl.innerHTML = 'Select a Letter.';
                if (evt.defaultPrevented) {
                    return;
                }

                var letter = evt.key || evt.keyCode;

                if (lettersRight.includes(letter) || lettersWrong.includes(letter)) {
                    messageEl.innerHTML = 'That letter has already been selected.';
                } 
                else if (command.indexOf(letter) > -1) {
                    currentWord = updateWord(letter, command, currentWord);
                    commandEl.innerHTML = currentWord.join('');
                    lettersRight.push(letter);
                    scoreEl.innerHTML = youWin(currentWord, score);
                    if (currentWord.indexOf("<span class='letter'>_</span>") === -1) {
                        messageEl.innerHTML = 'You win.';
                        score++;
                    }
                } else {
                    lettersWrong.push(letter);
                    totalGuesses--;
                    guessesEl.innerHTML = totalGuesses;
                    lettersEl.innerHTML = lettersWrong.join('');
                }
                letters.push(letter);
                if (totalGuesses === 0) {
                    messageEl.innerHTML = 'You lose, Try again.';
                }
            }); 
        });
    }
});