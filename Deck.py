from Card import *
import random
#deck class that uses card class
class Deck:
	#create an instance of each of the 52 cards
	def __init__(self):
		self.cards = []
		suit = ["hearts", "clubs", "diamonds", "spades"]
		rank = ["dud", "ace", "deuce", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"]
		for i in range(4):
			for j in range(1, 14):
				self.cards.append(Card(suit[i], rank[j], j))
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
		