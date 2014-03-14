from Card import *
from Deck import *

class Pyramid:

	def __init__(self):
		self.deck = Deck()
		self.pyramid = self.buildPyr()
		self.drawDeck = []
		self.trashDeck = []
		self.discardPile = []

	def buildPyr(self):
	  """ 
	  returns list of lists, each inner list containing one level of pyramid
	  [[[h0_0]],[[h1_0],[h1_1]], ...]
	  """
	  pyr = []

	  for i in range (0,6):
		thisLevel = []
	  
		for j in range (0,i+1):
		  nxtCard = self.deck.draw() # or whatever you get the idea
		  pyrSpotSpecs = [nxtCard, self.parents(i,j), self.children(i,j)]
		  thisLevel.append(pyrSpotSpecs)

		pyr.append(thisLevel)
	  return pyr

	def parents(self, i,j):
	  """
	  returns tuple containing 2 values co-ordinates of parent card or 
	  -1 if non-existent to avoid attempts to compare to null
	  """
	  if i == 0:
		return (-1,-1)
	  elif j == 0:
		return (-1,(i-1,j))
	  elif j == i+1:
		return ((i-1,j-1),-1)
	  else:
		return ((i-1,j),(i-1,j-1))

	def children(self, i,j):
	  if i == 6:
		return (-1,-1)
	  else:
		return ((i+1,j), (i+1,j+1))