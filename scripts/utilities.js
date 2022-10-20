
// Declaring game variables

export const X = 'X'
export const O = 'O'
export const EMPTY = null

/**
 * Returns starting state of the board.
 */
export function initialState() {
    return [
        [
            EMPTY, EMPTY, EMPTY
        ],
        [
            EMPTY, EMPTY, EMPTY
        ],
        [
            EMPTY, EMPTY, EMPTY
        ]
    ]
}

/**
 * Returns player who has the next turn on a board.
 */
export function player(board) {
    let moves = 0
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) { 
            // Check if board not empty and incrementing moves
            if (board[i][j]) moves += 1
        }
    }
    // Deciding turn
    if (moves % 2 == 0) 
        return X
    return O
}

/**
 * Returns set of all possible actions [i, j] available on the board.
 */

export function actions(board) {
    const possible_actions = new Set()
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) { 
            // Adding possible action if position empty
            if (! board[i][j]) possible_actions.add([i,j])
        }
    }
    return possible_actions
}
/**
 * Returns the board that results from making move (i, j) on the board.
 */
export function result(board, action){

    const [i, j] = action
    const new_board = structuredClone(board)
    const player_turn = player(board)
    new_board[i][j] = player_turn
    return new_board
}

/**
 * Returns the winner of the game, if there is one.
 */
export function winner(board){
    for (var i = 0; i < 3; i++){
        // Handling Horizontal win
        if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]){
      
            return board[i][0]
        }

        // Handling Vertical win
        if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]){
        
            return board[0][i]
        }
    }
    // Handling diagonal win
    if ((board[1][1]) && ((board[1][1] === board[0][0] && board[1][1] === board[2][2]) 
    || (board[1][1] === board[0][2] && board[1][1] === board[2][0])))  {

        return board[1][1]
    }
    return null
}

/**
 *  Returns true if game is over, false otherwise.
 */

export function terminal(board) {
    if (winner(board)){
        return true
    }
    for (var i = 0; i < 3; i++){
        for (var j = 0; j < 3; j++){
            // One board spot empty means game still running
            if (! board[i][j]){
                return false
            }
        }
    }
    // Otherwise, draw so game finished
    return true
}

/**
 * Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
 */
export function utility(board){
    const scores = {
        X: 1,
        O: -1
    }
    const player_winner = winner(board)
    return scores[player_winner] || 0
}


/**
 * Returns the optimal action for the current player on the board.
 */
export function minimax(board){

    function maxvalue(state){
        if (terminal(state)) return [utility(state), null]

        let optimal_score = -9999
        let optimal_action = null
        const current_actions = Array.from(actions(state))
        
        for (var i = 0; i < current_actions.length; i++){
            const [score, _] = minvalue(result(state, current_actions[i]))
            
                if (score > optimal_score){
                    optimal_score = score
                    optimal_action = current_actions[i]
                }
            
        }
        
        return [optimal_score, optimal_action]
      
    }
    
    function minvalue(state){
   
        if (terminal(state)) return [utility(state), null]

        let optimal_score = 9999
        let optimal_action = null
        const current_actions = Array.from(actions(state))
        for (var i = 0; i < current_actions.length; i++){
            const [score, _] = maxvalue(result(state,current_actions[i]))
                if (score < optimal_score){
                    optimal_score = score
                    optimal_action = current_actions[i]
                }
            
        }
        return [optimal_score, optimal_action]
    }

    if (player(board) == X) return maxvalue(board)[1]

    return minvalue(board)[1]
}

