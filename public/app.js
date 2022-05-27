var playerSym = ""
var aiSym = "O"
// 0 if not played, -1 opponent, 1 for AI
var currentState = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

function playAgain() {
    //Reset the game 
    currentState = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    document.querySelector('h1').innerHTML = "Let's do it"

    for (i = 0; i < 3; i++)
        for (j = 0; j < 3; j++)
            document.getElementById('' + i + j).innerHTML = '&nbsp;'

}

function chooseSym(e) {
    //Select symbol
    playerSym = e.innerHTML
    if(playerSym == aiSym)
        aiSym = "X"
    document.querySelector('.symbol').classList.add('hide')
    document.querySelector('.container').classList.remove('hide')
    document.querySelector('button.hide').classList.remove('hide')
}

function play(e) {
    //Check if played
    if (currentState[e.id[0]][e.id[1]] == 0) {
        e.innerHTML = playerSym
        currentState[e.id[0]][e.id[1]] = -1
        if(!isTerminal(currentState))
            alphaBetaSearch(currentState)
    }
    let state = gameUtility(currentState)
    if(state == 1)
        document.querySelector('h1').innerHTML = "AI is the smartest📯"
    else if(state == -1)
        document.querySelector('h1').innerHTML = "WoW you won📯"
    else if(isTerminal(currentState))
        document.querySelector('h1').innerHTML = "Draw"

    console.log(currentState)

}
c=0
//***********   Logic   ***********\\

function gameUtility(state) {
    for (i = 0; i < state.length; i++) {
        sum = state[i].reduce((prev, current) => prev + current, 0)
        if (sum == 3)
            return 1
        if (sum == -3)
            return -1
    }
    for (i = 0; i < state.length; i++) {
        sum = 0
        for (j = 0; j < state.length; j++)
            sum += state[j][i]
        if (sum == 3)
            return 1
        if (sum == -3)
            return -1
    }
    sum = [state[0][0] + state[1][1] + state[2][2], state[0][2] + state[1][1] + state[2][0]]
    if (sum[0] == 3 || sum[1] == 3)
        return 1
    if (sum[0] == -3 || sum[1] == -3)
        return -1
    return 0
}

function alphaBetaSearch(state) {
    t = maxValue(state, -2, 2)
    state[t[1][0]][t[1][1]] = 1
    document.getElementById(t[1]).innerHTML = aiSym
    return t
}

function maxValue(state, alpha, beta) {
    if (isTerminal(state))
        return [gameUtility(state), null]
    let v = -2
    let move = null
    for (let i = 0; i < state.length; i++) {
        for (let j = 0; j < state[i].length; j++) {
            if (state[i][j] == 0) {
                newState = copy(state)
                newState[i][j] = 1
                let t = minValue(newState, alpha, beta)
                let v2 = t[0]
                a2 = t[1]
                if (v2 > v) {
                    v = v2
                    move = '' + i + j
                    alpha = Math.max(alpha, v)
                }
                if (v >= beta){
                    return [v, move]
                }
            }
        }
    }
    return [v, move]
}

function minValue(state, alpha, beta) {
    if (isTerminal(state))
        return [gameUtility(state), null]
    let v = 2
    let move = null

    for (let i = 0; i < state.length; i++) {
        for (let j = 0; j < state[i].length; j++) {
            if (state[i][j] == 0) {
                newState = copy(state)
                newState[i][j] = -1
                let t = maxValue(newState, alpha, beta)
                let v2 = t[0]
                a2 = t[1]
                if (v2 < v) {
                    console.log('v changed')
                    v = v2
                    move = '' + i + j
                    beta = Math.min(beta, v)
                }
                if (v <= alpha)
                    return [v, move]
            }
        }
    }
    return [v, move]
}

function isTerminal(state) {
    if(gameUtility(state) == 0)
        for (i = 0; i < state.length; i++)
            for (j = 0; j < state[i].length; j++) {
                if (state[i][j] == 0)
                    return false
            }
    return true
}

function copy(state) {
    return state.map(e => [...e])
}

