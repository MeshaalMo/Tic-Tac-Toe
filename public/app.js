var player_symbol = ""
var AI_symbol = "O"
// 0 if not played, -1 opponent, 1 for AI
var currentState = { board: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], actions: ['11', '00', '02', '20', '22', '12', '01', '10', '21'] }

function playAgain() {
    //Reset the game 
    currentState = { board: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], actions: ['11', '00', '02', '20', '22', '12', '01', '10', '21'] }
    document.querySelector('h1').innerHTML = "Let's do it"

    for (i = 0; i < 3; i++)
        for (j = 0; j < 3; j++)
            document.getElementById('' + i + j).innerHTML = '&nbsp;'

}

function chooseSym(e) {
    //Select symbol
    player_symbol = e.innerHTML
    if (player_symbol == AI_symbol)
        AI_symbol = "X"
    document.querySelector('.symbol').classList.add('hide')
    document.querySelector('.container').classList.remove('hide')
    document.querySelector('button.hide').classList.remove('hide')
    document.querySelector('h1').innerHTML = "Let's do it"

}

function play(e) {
    //Check if played
    if (currentState.board[e.id[0]][e.id[1]] == 0 && !isTerminal(currentState)) {
        e.innerHTML = player_symbol
        currentState.board[e.id[0]][e.id[1]] = -1
        currentState.actions = currentState.actions.filter((v, i, arr) => v != e.id)
        if (!isTerminal(currentState))
            alphaBetaSearch(currentState)
    }
    let state = gameUtility(currentState)
    if (state == 1)
        document.querySelector('h1').innerHTML = "AI is the smartest📯"
    else if (state == -1)
        document.querySelector('h1').innerHTML = "WoW you won📯"
    else if (isTerminal(currentState))
        document.querySelector('h1').innerHTML = "Draw"

}

//***********   Logic   ***********\\

//Sate of the game: 1 -> AI won,  0 -> Tie, -1 -> AI lose
function gameUtility(state) {
    //Check Rows & Cols
    for (i = 0; i < state.board.length; i++) {
        sum_row = state.board[i].reduce((prev, current) => prev + current, 0)
        sum_col = 0
        for (j = 0; j < state.board.length; j++)
            sum_col += state.board[j][i]
        if (sum_row == 3 || sum_col == 3)
            return 1
        if (sum_row == -3 || sum_col == -3)
            return -1
    }
    //Check Diagonals
    sum = [state.board[0][0] + state.board[1][1] + state.board[2][2], state.board[0][2] + state.board[1][1] + state.board[2][0]]
    if (sum[0] == 3 || sum[1] == 3)
        return 1
    if (sum[0] == -3 || sum[1] == -3)
        return -1
    return 0
}

function alphaBetaSearch(state) {
    t = maxValue(state, -2, 2)
    state.board[t[1][0]][t[1][1]] = 1
    currentState.actions = currentState.actions.filter((v, i, arr) => v != t[1])
    document.getElementById(t[1]).innerHTML = AI_symbol
    return t
}

function maxValue(state, alpha, beta) {
    if (isTerminal(state))
        return [gameUtility(state), null]
    let v = -2
    let move = null
    state.actions.every(a => {
        newState = copy(state)
        newState.board[a[0]][a[1]] = 1
        newState.actions = newState.actions.filter((v, i, arr) => v != a)
        let t = minValue(newState, alpha, beta)
        let v2 = t[0]
        if (v2 > v) {
            v = v2
            move = a
            alpha = Math.max(alpha, v)
        }
        if (v >= beta) {
            console.log('Max burn')
            return false
        }
        return true
    })
    return [v, move]
}

function minValue(state, alpha, beta) {
    if (isTerminal(state))
        return [gameUtility(state), null]
    let v = 2
    let move = null
    state.actions.every(a => {
        newState = copy(state)
        newState.board[a[0]][a[1]] = -1
        newState.actions = newState.actions.filter((v, i, arr) => v != a)
        let t = maxValue(newState, alpha, beta)
        let v2 = t[0]
        if (v2 < v) {
            v = v2
            move = a
            beta = Math.min(beta, v)
        }
        if (v <= alpha) {
            console.log('Min burn')
            return false
        }
        return true
    })
    return [v, move]
}

function isTerminal(state) {
    if (!gameUtility(state) && state.actions.length)
        return false
    return true
}

function copy(state) {
    return { board: state.board.map(e => [...e]), actions: [...state.actions] }
}