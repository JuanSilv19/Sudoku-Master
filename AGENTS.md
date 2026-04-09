# Agent Guidelines - Sudoku Game

## Project Overview
This is a vanilla JavaScript Sudoku game with HTML, CSS, and JS in separate files. No build tools or frameworks used.

## Build/Lint/Test Commands

### Running the Project
```bash
# Open index.html directly in a browser, or serve with:
python -m http.server 8000
# Then visit http://localhost:8000
```

### No Testing/Linting Configured
This project does not currently have:
- No test framework (Jest, Vitest, etc.)
- No linter (ESLint)
- No type checker (TypeScript)
- No build tool (Webpack, Vite)

## Code Style Guidelines

### JavaScript
- **Indentation**: 4 spaces
- **Naming**:
  - Functions: camelCase (e.g., `generate`, `checkSolution`)
  - Variables: camelCase (e.g., `selectedNum`, `board`)
  - Constants: UPPER_SNAKE_CASE (e.g., `BOARD_SIZE`)
- **Quotes**: Single quotes for strings
- **Semicolons**: Required at end of statements
- **Variables**: Use `const` by default, `let` when reassignment needed, avoid `var`
- **Arrow functions**: Allowed for callbacks
- **Compatibility**: Use `function` declarations for event handlers (better browser compatibility)

### HTML/CSS
- **Indentation**: 4 spaces
- **CSS properties**: One per line
- **Units**: `px` for fixed sizes
- **Naming**: kebab-case for classes (e.g., `.sudoku-board`, `.cell-fixed`)

## Project Structure
```
sudoku/
├── index.html      # HTML structure with timer
├── style.css       # CSS styles including timer and validation
├── script.js       # JavaScript logic with timer and validation
└── AGENTS.md       # This file
```

## Architecture

### Game State Variables
- `board`: 9x9 2D array, current player state (0 = empty)
- `solution`: 9x9 2D array, complete solved board
- `initialBoard`: 9x9 2D array, original puzzle (cells not modifiable)
- `selectedNum`: Currently selected number from numpad (null or 0-9)
- `selectedCell`: Reference to currently selected cell element
- `seconds`: Current timer value in seconds
- `timerInterval`: Reference to the setInterval timer
- `gameWon`: Boolean flag indicating if game is complete

### Key Functions
- `generate()`: Creates new puzzle with backtracking
- `fillBoard(b)`: Recursive backtracking solver
- `removeNumbers(count)`: Removes cells to create puzzle
- `render()`: Updates DOM from board state
- `selectCell(row, col)`: Handles cell selection
- `selectNum(num)`: Handles number selection from numpad
- `validateBoard()`: Checks for conflicts in rows, columns, 3x3 boxes
- `checkWin()`: Checks if board is complete and correct
- `startTimer()` / `stopTimer()`: Timer control
- `showWinMessage()`: Displays victory message with time
- `solve()`: Reveals full solution

### CSS Classes
- `.cell`: Basic cell styling
- `.cell.fixed`: Initial puzzle numbers (non-editable)
- `.cell.selected`: Currently selected cell (blue background)
- `.cell.user-input`: Numbers entered by player
- `.cell.invalid`: Numbers that conflict with row/column/box
- `.timer`: Timer display at top of game

## Adding Features

### New Difficulty Levels
Modify `removeNumbers(40)` in `generate()`:
```javascript
// Easy: ~35-40 removed, Medium: ~45-50, Hard: ~55-60
removeNumbers(45);
```

### Adding Hints
```javascript
function hint() {
    // Find random empty cell and fill with solution value
}
```

## CSS Grid Layout for Sudoku
```css
#sudoku-board {
    display: grid;
    grid-template-columns: repeat(9, 45px);
    grid-template-rows: repeat(9, 45px);
}
```

### 3x3 Region Borders
```css
.cell:nth-child(3n) {
    border-right: 2px solid #222;
}
.cell:nth-child(n+19):nth-child(-n+27),
.cell:nth-child(n+46):nth-child(-n+54) {
    border-bottom: 2px solid #222;
}
```

### Validation Highlighting
```css
.cell.invalid {
    background-color: #ffcdd2 !important;
    color: #c62828 !important;
}
```

### Timer Styling
```css
.timer {
    font-family: 'Courier New', monospace;
    font-size: 24px;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 8px;
}
```

## Error Handling
- Solve algorithm handles unsolvable boards gracefully (returns false)
- DOM operations check element existence
- All board operations validate indices (0-8)
- Validation runs after each number placement to show conflicts immediately

## Browser Compatibility
- Uses ES5+ features (var, function declarations)
- No polyfills needed for modern browsers
- Tested in Chrome, Firefox, Safari (latest versions)