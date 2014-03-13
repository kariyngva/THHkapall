#class for individual card
class Card:
	
	def __init__(self, suit, rank, value):
		self.rank = rank
		self.suit = suit
		self.value = value