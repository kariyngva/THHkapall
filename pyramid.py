from Card import *
from Deck import *

class Pyramid:

	def __init__(self, difficulty):
		self.deck = Deck()
		self.pyramid = self.buildPyr()
		self.drawDeck = []
		self.trashDeck = []
		self.discardPile = []
		for i in range(0,len(self.deck.cards)):
			self.drawDeck.append(self.deck.draw())
		self.score = 0
		self.difficulty = difficulty
		self.tempPyramid = []
		for i in range(len(self.pyramid)):
			self.tempPyramid.append(self.pyramid[i])
		self.tempDrawDeck = []
		for i in range(len(self.drawDeck)):
			self.tempDrawDeck.append(self.drawDeck[i])
	
	#byggir píramídann sjálfann sem lista af listum
	def buildPyr(self):
	  """ 
	  returns list of lists, each inner list containing one level of pyramid
	  [[[h0_0]],[[h1_0],[h1_1]], ...]
	  """
	  pyr = []

	  for i in range (0,7):
		thisLevel = []
	  
		for j in range (0,i+1):
		  nxtCard = self.deck.draw() # or whatever you get the idea
		  pyrSpotSpecs = [nxtCard, self.parents(i,j), self.children(i,j)]
		  thisLevel.append(pyrSpotSpecs)

		pyr.append(thisLevel)
	  return pyr
	
	#dregur spil úr bunka og setur það í trashdeck
	#þá sést næsta spil í drawDeck
	def drawDeckdraw(self):
		if len(self.drawDeck) > 0:
			self.trashDeck.append(self.drawDeck.pop())
		elif self.difficulty > 0:
			for i in range(len(trashDeck)):
				drawDeck.append(trashDeck.pop(-1))
		else:
			return -1
			
		
		
	#hnit foreldra: -1 er enginn
	def parents(self, i,j):
	  """
	  returns tuple containing 2 values co-ordinates of parent card or 
	  -1 if non-existent to avoid attempts to compare to null
	  """
	  if i == 0:
		return [-1,-1]
	  elif j == 0:
		return [-1,[i-1,j]]
	  elif j == i+1:
		return [[i-1,j-1],-1]
	  else:
		return [[i-1,j],[i-1,j-1]]
	
	#hnit barna: -1 er enginn
	def children(self, i,j):
	  if i == 6:
		return [-1,-1]
	  else:
		return [[i+1,j], [i+1,j+1]]
		
	#athuga hvort spilið er laust	
	def checkFree(self,i, j):
	  if self.pyramid[i][j][2] == [-1,-1]:
		return True
	  else:
		return False
	#upfæra "frjáls" spil
	def updateRem(self,i,j):
		if j >= 1:
			self.pyramid[i-1][j-1][2][1]= -1
		if j!=i:
			self.pyramid[i-1][j][2][0]= -1	