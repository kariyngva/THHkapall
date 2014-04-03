#coding=UTF-8
from bottle import route, run, template, post, request, static_file, redirect
from pyramid import *
from highscore import*

gameDifficulty = 3 #default
pyramid = Pyramid( gameDifficulty )

@route('/')
def index():
    topOfDrawDeck = pyramid.drawDeckTop()
    #topOfActiveDeck = pyramid.activeDeck

    return template( 'main', drawDeck = topOfDrawDeck, activeDeck = pyramid.activeDeck, pyramid = pyramid.pyramid, score = pyramid.getScore() )

@route('/drawFromMainDeck')
def drawFromDeck():
    lastCard = pyramid.drawDeckdraw();
    card = pyramid.drawDeckTop()

    return { 'suit': card.suit, 'rank': card.rank, 'val': card.value, 'lastcard': lastCard }


@route('/getTopOfDraw')
def getTopOfDraw():
    card = pyramid.drawDeckTop()
    if card is False:
        return { 'lastcard': -1 }
    return { 'suit': card.suit, 'rank': card.rank, 'val': card.value, 'lastcard': 1 }


@route('/drawFromActiveDeck')
def drawFromActiveDeck():
    card = pyramid.activeDeckTop()

    if card is False:
        return { 'lastcard': -1 }

    return { 'suit': card.suit, 'rank': card.rank, 'val': card.value, 'lastcard': 1 }


@route('/setDifficulty/:difficulty')
def setDifficulty(difficulty):
    global gameDifficulty
    gameDifficulty = difficulty
    pyramid.newGame( gameDifficulty )
    redirect('/')


@route('/sethighscore/:name')
def sethighscore(name):
    input_score( pyramid.getScore(), name )


@route('/newgame')
def newGame():
    global gameDifficulty
    print "--------gameDifficulty--------"
    print gameDifficulty
    pyramid.newGame( gameDifficulty )
    redirect("/")


@route('/resetgame')
def resetgame():
    pyramid.returnToInit()
    redirect("/")


@route('/undolastmove')
def undolastmove():
    pyramid.Undo()
    redirect("/")


@route('/highscorejson')
def highscorejson():
    return { "score": top10_highscores() }


@route('/highscore')
def highscore():
        return template( 'highscore', scores = top10_highscores())


@route('/updatescore')
def updatescore():
    return { 'score': pyramid.getScore() }


@route('checkwin')
def checkwin():
    return {'success' : pyramid.checkWin()}


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
    card = pyramid.drawDeckTop() if int( fromDraw ) == True else pyramid.activeDeckTop()

    if card is False:
        return { 'success': False }

    return {
        'success': pyramid.deckToPyramid( card, int( fromDraw ), int( i ), int( j ) )
        };


@route('/checkKingPyr/:i/:j')
def checkKingPyr(i, j):
    return { 'success': pyramid.checkKingPyr( int( i ), int( j ) ) };


@route('/kingdeck/:fromDraw')
def checkKingDeck(fromDraw):
    card = pyramid.drawDeckTop() if int( fromDraw ) == True else pyramid.activeDeckTop()

    if card is False:
        return { 'success': False }

    return {
        'success': pyramid.checkKingDeck( int( fromDraw ), card )
        };


@route('/decktodeck')
def deckToDeck():
    print "deckTodeck - from kapall.py"
    return { 'success': pyramid.deckToDeck() };


@route('/getstarttime')
def getStartTime():
    return { 'starttime': pyramid.getStartTime() }


##Debug
@route('/debug')
def debug():
    return template( 'debug', pyramid = pyramid )


@route('/static/<filename>')
def server_static(filename):
    return static_file(filename, root='./static')


@route('/static/<path:path>')
def callback(path):
    return static_file(path, root='./static')


run(reloader=True, host='localhost', port=8080)