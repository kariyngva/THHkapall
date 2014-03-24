#coding=UTF-8
from bottle import route, run, template, post, request, static_file
from pyramid import *

pyramid = Pyramid(3)

@route('/')
def index():
    topOfDrawDeck = pyramid.drawDeck[0]
    #topOfActiveDeck = pyramid.activeDeck

    #þarf að tékka hvort að activedeck sé með len()>0 og setja þá inn

    return template( 'main', drawDeck = topOfDrawDeck, activeDeck = pyramid.activeDeck, pyramid = pyramid.pyramid )

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
    pyramid.Undo()

@route('/isfree/:i/:j')
def isfree(i,j):
    return { 'isfree': pyramid.checkFree( int( i ), int( j )) };


@route('/pyramidToPyramid/:i/:j/:k/:l')
def pyramidToPyramid(i, j, k, l):
    return {
        'success': pyramid.pyramidToPyramid( int( i ), int( j ), int( k ), int( l ) )
        };

@route('/deckToPyramid/:fromDraw/:i/:j')
def deckToPyramid( fromDraw, i, j):
    card = pyramid.drawDeck[0] if bool( fromDraw ) == True else pyramid.activeDeck[-1]

    return {
        'success': pyramid.deckToPyramid( card, bool( fromDraw ), int( i ), int( j ) )
        };

@route('/deckToDeck')
def deckToDeck():
    #Svo activeCard breytin okkar hérna f. neðan valdi ekki villu.
    if len( pyramid.activeDeck ) == 0:
        return { 'success': False };

    drawCard = pyramid.drawDeck[0];
    activeCard = pyramid.activeDeck[-1];

    return { 'success': pyramid.deckToDeck( drawCard, activeCard ) };

@route('/static/<filename>')
def server_static(filename):
    return static_file(filename, root='./static')

@route('/static/<path:path>')
def callback(path):
    return static_file(path, root='./static')

run(reloader=True, host='localhost', port=8080)