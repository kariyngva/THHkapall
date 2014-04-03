from Card import *
import random
#deck class that uses card class
class Deck:
	#create an instance of each of the 52 cards
	def __init__(self):
		self.cards = []
		suit = ["hearts", "clubs", "diamonds", "spades"]
		rank = ["ace", "deuce", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"]
		for i in range(4):
			for card in rank:
				self.cards.append( Card( suit[i], card, rank.index(card)+1 ) )
		self.shuffle()
	#randomize deck
	def shuffle(self):
		random.shuffle(self.cards)
	#draw the next card
	def draw(self):
		return self.cards.pop()
	#give the card count
	def count(self):
		return len(self.cards)
