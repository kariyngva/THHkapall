#coding=UTF-8
from bottle import route, run, template, post, request, static_file
from pyramid import *

#pyramid = new pyramid()

@route('/')
def index():
    return template( 'main' )

@route('/drawFromDeck')
def drawFromDeck():
    ##card = game.drawFromdeck()
    #check if we have cards left in the drawdeck
    return {'suit': 'diamonds', 'rank': 'king', 'lastcard': False}


@route('/setDifficulty/:difficulty')
def setDifficulty(difficulty='easy'):
    pyramid.setDifficulty(difficulty)

@route('/newgame')
def newgame():
    #pyramid.newgame()
    return {'lol': 'newgame'}


@route('/resetgame')
def resetgame():
    #pyramid.resetGame()
    return {'lol': 'reset'}

@route('/undolastmove')
def undolastmove():
    #pyramid.undoLastMove()
    return {'lol': 'undo'}

@route('/isfree')
def isfree():
    return { 'isfree': pyramid.checkFree() };


@route('/static/<filename>')
def server_static(filename):
    return static_file(filename, root='./static')

@route('/static/<path:path>')
def callback(path):
    return static_file(path, root='./static')

run(host='localhost', port=8080)