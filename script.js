console.log('SUDOKU CARGADO CORRECTAMENTE');

let board = [];
let solution = [];
let initialBoard = [];
let selectedNum = null;
let selectedCell = null;
let timerInterval = null;
let seconds = 0;
let gameWon = false;

function formatTime(secs) {
    var m = Math.floor(secs / 60);
    var s = secs % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

function startTimer() {
    stopTimer();
    seconds = 0;
    gameWon = false;
    document.getElementById('timer').textContent = 'Tiempo: 00:00';
    timerInterval = setInterval(function() {
        if (!gameWon) {
            seconds++;
            document.getElementById('timer').textContent = 'Tiempo: ' + formatTime(seconds);
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function showWinMessage() {
    gameWon = true;
    stopTimer();
    var msg = document.getElementById('message');
    msg.textContent = 'Felicidades! Lo lograste en ' + formatTime(seconds);
    msg.className = 'message success';
}

function generate() {
    board = Array(9).fill(null).map(function() { return Array(9).fill(0); });
    solution = Array(9).fill(null).map(function() { return Array(9).fill(0); });
    fillBoard(board);
    for (var i = 0; i < 9; i++) {
        solution[i] = board[i].slice();
    }
    removeNumbers(40);
    initialBoard = board.map(function(row) { return row.slice(); });
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function isValidLocal(b, row, col, num) {
    for (var i = 0; i < 9; i++) {
        if (b[row][i] === num) return false;
    }
    for (var i = 0; i < 9; i++) {
        if (b[i][col] === num) return false;
    }
    var boxRow = Math.floor(row / 3) * 3;
    var boxCol = Math.floor(col / 3) * 3;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (b[boxRow + i][boxCol + j] === num) return false;
        }
    }
    return true;
}

function findEmpty(b) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (b[i][j] === 0) return [i, j];
        }
    }
    return null;
}

function fillBoard(b) {
    var empty = findEmpty(b);
    if (!empty) return true;
    var row = empty[0];
    var col = empty[1];
    var nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (var k = 0; k < nums.length; k++) {
        var num = nums[k];
        if (isValidLocal(b, row, col, num)) {
            b[row][col] = num;
            if (fillBoard(b)) return true;
            b[row][col] = 0;
        }
    }
    return false;
}

function removeNumbers(count) {
    var positions = [];
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            positions.push([i, j]);
        }
    }
    shuffle(positions);
    for (var i = 0; i < count; i++) {
        board[positions[i][0]][positions[i][1]] = 0;
    }
}

function isValidPlacement(row, col, num) {
    for (var i = 0; i < 9; i++) {
        if (i !== col && board[row][i] === num) return false;
    }
    for (var i = 0; i < 9; i++) {
        if (i !== row && board[i][col] === num) return false;
    }
    var boxRow = Math.floor(row / 3) * 3;
    var boxCol = Math.floor(col / 3) * 3;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            var r = boxRow + i;
            var c = boxCol + j;
            if ((r !== row || c !== col) && board[r][c] === num) return false;
        }
    }
    return true;
}

function validateBoard() {
    var cells = document.querySelectorAll('.cell');
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var index = i * 9 + j;
            var cell = cells[index];
            var num = board[i][j];
            if (num !== 0 && initialBoard[i][j] === 0) {
                if (!isValidPlacement(i, j, num)) {
                    cell.classList.add('invalid');
                } else {
                    cell.classList.remove('invalid');
                }
            }
        }
    }
}

function checkWin() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] !== solution[i][j]) return false;
        }
    }
    return true;
}

function render() {
    var container = document.getElementById('sudoku-board');
    container.innerHTML = '';
    
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = board[i][j] || '';
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-col', j);
            
            if (initialBoard[i][j] !== 0) {
                cell.classList.add('fixed');
            }
            
            cell.onclick = (function(row, col) {
                return function() {
                    selectCell(row, col);
                };
            })(i, j);
            
            container.appendChild(cell);
        }
    }
}

function selectCell(row, col) {
    if (gameWon) return;
    
    if (initialBoard[row][col] !== 0) {
        return;
    }
    
    var previousSelected = document.querySelector('.cell.selected');
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }
    
    var cells = document.getElementById('sudoku-board').children;
    var index = row * 9 + col;
    selectedCell = cells[index];
    selectedCell.classList.add('selected');
    
    if (selectedNum !== null) {
        board[row][col] = selectedNum;
        selectedCell.textContent = selectedNum || '';
        selectedCell.classList.remove('user-input');
        if (selectedNum !== 0) {
            selectedCell.classList.add('user-input');
        }
        validateBoard();
        
        if (checkWin()) {
            showWinMessage();
        }
    }
}

function selectNum(num) {
    selectedNum = num;
    
    var buttons = document.querySelectorAll('.num-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('selected');
        if (parseInt(buttons[i].getAttribute('data-num')) === num) {
            buttons[i].classList.add('selected');
        }
    }
    
    if (selectedCell && selectedNum !== null) {
        var row = parseInt(selectedCell.getAttribute('data-row'));
        var col = parseInt(selectedCell.getAttribute('data-col'));
        board[row][col] = selectedNum;
        selectedCell.textContent = selectedNum || '';
        selectedCell.classList.remove('user-input');
        if (selectedNum !== 0) {
            selectedCell.classList.add('user-input');
        }
        validateBoard();
        
        if (checkWin()) {
            showWinMessage();
        }
    }
}

function newGame() {
    stopTimer();
    generate();
    selectedNum = null;
    selectedCell = null;
    
    var buttons = document.querySelectorAll('.num-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('selected');
    }
    
    document.getElementById('message').textContent = '';
    document.getElementById('message').className = 'message';
    
    render();
    startTimer();
}

function checkSolution() {
    if (checkWin()) {
        showWinMessage();
    } else {
        var msg = document.getElementById('message');
        msg.textContent = 'Aun no es correcto';
        msg.className = 'message error';
    }
}

function solve() {
    gameWon = true;
    stopTimer();
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            board[i][j] = solution[i][j];
        }
    }
    render();
    document.getElementById('message').textContent = 'Resuelto!';
    document.getElementById('message').className = 'message success';
}

// Event Listeners
document.getElementById('new-game').onclick = newGame;
document.getElementById('check-solution').onclick = checkSolution;
document.getElementById('solve').onclick = solve;

var numButtons = document.querySelectorAll('.num-btn');
for (var i = 0; i < numButtons.length; i++) {
    numButtons[i].onclick = (function(btn) {
        return function() {
            selectNum(parseInt(btn.getAttribute('data-num')));
        };
    })(numButtons[i]);
}

// Keyboard support
document.onkeydown = function(e) {
    if (!selectedCell || gameWon) return;
    
    if (e.key >= '1' && e.key <= '9') {
        selectNum(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        selectNum(0);
    } else if (e.key === 'Escape') {
        if (selectedCell) {
            selectedCell.classList.remove('selected');
            selectedCell = null;
        }
        selectedNum = null;
        var buttons = document.querySelectorAll('.num-btn');
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('selected');
        }
    }
};

// Initialize game
newGame();