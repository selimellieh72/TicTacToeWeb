import * as ttt from './utilities.js' 
import * as helpers from './helpers.js'


let board = ttt.initialState()
let user = ttt.X


function displayBoard(board){
    
   const ttt_table = document.querySelector('table');
   ttt_table.innerHTML = ''
    board.forEach((row, index) => {
        const tr = document.createElement('tr')
        tr.dataset.row = index
        row.forEach((item, index) => {
            const td = document.createElement('td')
            td.dataset.column = index
            td.innerText = item || ''
            tr.appendChild(td)
        })
        ttt_table.appendChild(tr)
    })
}

function checkAndUpdateIfOver(board){

    setTimeout(()=> {
    if (ttt.terminal(board)){
        document.querySelector('.game-options').style.display = 'none'
        document.querySelector('.game').style.display = 'none'
        document.querySelector('.over').style.display = 'block'
        
        document.querySelector('h2').innerText = ttt.winner(board) ? 
        `${ttt.winner(board)} has won the game` : 'Tie!'
    }
   }, 500)
 
}



async function makeAIMoveThenUpdate(board) {
    document.querySelector('.turn-status').innerText = 'AI is thinking...'
    const _ = await helpers.wait(1000)
    board = ttt.result(board, ttt.minimax(board))
    displayBoard(board)
    if (!ttt.terminal(board)){
        document.querySelector('.turn-status').innerText = `${ttt.player(board)} player turn!`
    }
    
    checkAndUpdateIfOver(board)
    return board
}



document.addEventListener('click', async (event) => {
    
    if (event.target.nodeName == 'BUTTON' && event.target.dataset.player) {
        
        document.querySelector('.game-options').style.display = 'none'
        document.querySelector('.game').style.display = 'block'
        document.querySelector('.over').style.display = 'none'
        user = event.target.dataset.player
        displayBoard(board)
        if (ttt.player(board) === user) {
            document.querySelector('.turn-status').innerText = `${ttt.player(board)} player turn!`
        } else {
           board = await makeAIMoveThenUpdate(board)
        }
    }

    else if (event.target.nodeName == 'BUTTON' && event.target.id == 'try-again-btn') {
  
        board = ttt.initialState()
        document.querySelector('.game-options').style.display = 'block'
        document.querySelector('.game').style.display = 'none'
        document.querySelector('.over').style.display = 'none'
    }
    
    else if (!ttt.terminal(board) && user === ttt.player(board) && event.target.nodeName == 'TD'){
        const j = event.target.dataset.column
        const i = event.target.parentNode.dataset.row
        if (! board[i][j]){
            board = ttt.result(board, [i, j])
            displayBoard(board)
            checkAndUpdateIfOver(board)    
            if (!ttt.terminal(board)){
               board = await makeAIMoveThenUpdate(board)
            }
        
        }
    }
  
})