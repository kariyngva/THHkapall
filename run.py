#coding=UTF-8
from bottle import route, run, template, post, request, static_file
from pyramid import *

pyramid = Pyramid(3)

@route('/')
def index():
    topOfDrawDeck = pyramid.drawDeck[0]

    return template( 'main', drawDeck = topOfDrawDeck, pyramid = pyramid.pyramid )

@route('/drawFromDeck')
def drawFromDeck():
    lastCard = pyramid.drawDeckdraw();
    card = pyramid.drawDeck[0]

    return {'suit': card.suit, 'rank': card.rank, 'lastcard': lastCard}

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

@route('/isfree/:i/:j')
def isfree(i,j):
    return { 'isfree': pyramid.checkFree( int( i ), int( j )) };


@route('/static/<filename>')
def server_static(filename):
    return static_file(filename, root='./static')

@route('/static/<path:path>')
def callback(path):
    return static_file(path, root='./static')

run(host='localhost', port=8080)