'use strict'

const getFormfields = require('./../../lib/get-form-fields')
const api = require('./api')
const ui = require('./ui')
const store = require('../store.js')

const onSignUp = function (event) {
  event.preventDefault()
  const form = event.target
  const data = getFormfields(form)
  api.signUp(data).then(ui.signUpSuccess)
  .catch(ui.signUpFailure)
}
const onSignIn = (event) => {
  event.preventDefault()
  const form = event.target
  const data = getFormfields(form)
  api.signIn(data).then(ui.signInSuccess).catch(ui.signInFailure)
}

const onSignOut = function (event) {
  api.signOut()
    .then(ui.signOutSuccess)
    .catch(ui.signOutFailure)
}

const onNewGame = function(event){
  event.preventDefault()
  api.newGame()
    .then(function(data) {
      ui.newGameSuccess()
      store.game = {
        _id: data.game._id,
        player: 'x'
      }
      ui.drawGameBoard(data.game.cells)
      console.log(data)
    })
}

const onPlay = function(event) {
  event.preventDefault()

  let cellIndex = $(event.target).data('cell-index')
  console.log('onPlay cellIndex: ' + cellIndex)
  let tie = false
  let win = false
  ui.accessCell(cellIndex).off('click');
  
  win = ui.didAnyoneWin(cellIndex)
  if (!win) {
    tie = ui.isBoardFull(cellIndex)
  }

  let gameOver = tie || win

  api.play(cellIndex, gameOver)
    .then(function(data) {
      store.game.player = store.game.player === 'x' ? 'o' : 'x'
      ui.drawGameBoard(data.game.cells)
      console.log(data)
    })

  if (win) {
    ui.showWin()
  }
  else if (tie) {
    ui.showTie()
  }
} 

module.exports = {
  onSignUp,
  onSignIn,
  onSignOut,
  onNewGame,
  onPlay
}
