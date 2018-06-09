window.onload = function () {
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

    function startGame(game) {
        randCommand = getRandCommand();
        messageEl.innerHTML = 'Select a Letter.';

        randCommand.then(function (cmd) {
            scoreEl.innerHTML = game.score;
            guessesEl.innerHTML = game.totalGuesses;
            lettersEl.innerHTML = game.lettersWrong.join('');
            messageEl.style.display = 'block';
            descriptionEl.innerHTML = cmd.description;
            currentWord = initWord(cmd.command);
            commandEl.innerHTML = currentWord.join('');
        });
    }

    function resetGame(game) {
        randCommand = getRandCommand();
        scoreEl.innerHTML = game.score;
        game.letters = [];
        game.lettersRight = [];
        game.lettersWrong = [];
        game.totalGuesses = 10;

        randCommand.then(function (cmd) {
            scoreEl.innerHTML = game.score;
            guessesEl.innerHTML = game.totalGuesses;
            lettersEl.innerHTML = game.lettersWrong.join('');
            messageEl.style.display = 'block';
            descriptionEl.innerHTML = cmd.description;
            currentWord = initWord(cmd.command);
            commandEl.innerHTML = currentWord.join('');
        });
    }

    var descriptionEl = document.getElementById('description');
    var excludedKeys = [8, 13, 16, 17, 18, 20, 27, 27, 28, 39, 40, 91];
    var fKeys = [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123];
    var commandEl = document.getElementById('command');
    var messageEl = document.getElementById('message');
    var scoreEl = document.getElementById('score');
    var guessesEl = document.getElementById('guesses');
    var lettersEl = document.getElementById('letters');
    var randCommand = {};
    var currentWord = ''; 
    var gameInfo = {
        score: 0,
        letters: [],
        lettersRight: [],
        lettersWrong: [],
        totalGuesses: 10
    }

    startGame(gameInfo);

    document.body.addEventListener('keyup', function(evt) {
        messageEl.innerHTML = 'Select a Letter.';
        guessesEl.innerHTML = gameInfo.totalGuesses;
        var key = '';

        if (evt.defaultPrevented) {
            return;
        }

        if (excludedKeys.includes(evt.keyCode) || fKeys.includes(evt.keyCode)) {
            key = 'excludedKey';
        } else {
            key = evt.key.toLowerCase() || evt.keyCode;
        }

        randCommand.then(function (cmd) {
            messageEl.innerHTML = 'Select a Letter.';
            if (gameInfo.lettersRight.includes(key) || gameInfo.lettersWrong.includes(key)) {
                messageEl.innerHTML = 'That letter has already been selected.';
            } else if (cmd.command.indexOf(key) > -1) {
                currentWord = updateWord(key, cmd.command, currentWord);
                commandEl.innerHTML = currentWord.join('');
                gameInfo.lettersRight.push(key);
                scoreEl.innerHTML = youWin(currentWord, gameInfo.score);
                if (currentWord.indexOf("<span class='letter'>_</span>") === -1) {
                    messageEl.innerHTML = 'Got it, Try another.';
                    gameInfo.score++;
                    resetGame(gameInfo);
                }
            } else if (key !== 'excludedKey') {
                gameInfo.lettersWrong.push(key);
                gameInfo.totalGuesses--;
                guessesEl.innerHTML = gameInfo.totalGuesses;
                lettersEl.innerHTML = gameInfo.lettersWrong.join('');

                // log hint when out of guesses
                if (gameInfo.totalGuesses === 1) {
                    console.log(cmd.command);
                }
            }
            gameInfo.letters.push(key);
            if (gameInfo.totalGuesses === 0) {
                messageEl.innerHTML = 'Out of guesses, Try again.';
                commandEl.innerHTML = '';
                resetGame(gameInfo);
            }
        });
    });
}