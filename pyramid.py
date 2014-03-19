from Card import *
from Deck import *

class Pyramid:

	def __init__(self, difficulty):
		self.deck = Deck() #stokkurinn
		self.pyramid = self.buildPyr() #hluti af stokknum verður pýramíddi
		self.drawDeck = [] #fyrri stokkurinn af spilum
		self.trashDeck = []	#seinni stokkurinn af spilum
		self.discardPile = [] #spilin sem að hafa verið tekin út
		for i in range(0,len(self.deck.cards)):
			self.drawDeck.append(self.deck.draw())
		self.score = 0
		self.difficulty = difficulty #því hærri tala því auðveldari er leikurinn
		self.tempPyramid = [] #state savefyrir restart same game
		for i in range(len(self.pyramid)):
			self.tempPyramid.append(self.pyramid[i])
		self.tempDrawDeck = []#state savefyrir restart same game
		for i in range(len(self.drawDeck)):
			self.tempDrawDeck.append(self.drawDeck[i])
	
	#byggir píramídann sjálfann sem lista af listum
	#hvert stak í listunum inniheldur spil og hnit fyrir foreldri og börn sbr. tré
	def buildPyr(self):
	  """ 
	  returns list of lists, each inner list containing one level of pyramid
	  [[[h0_0]],[[h1_0],[h1_1]], ...]
	  """
	  pyr = [] #tímabundin breyta

	  for i in range (0,7): #sex hæðir
		thisLevel = [] #hver hæð
	  
		for j in range (0,i+1):
		  nxtCard = self.deck.draw() # or whatever you get the idea
		  pyrSpotSpecs = [nxtCard, self.parents(i,j), self.children(i,j)] #hver eind
		  thisLevel.append(pyrSpotSpecs)

		pyr.append(thisLevel)
	  return pyr
	
	#dregur spil úr bunka og setur það í trashdeck
	#þá sést næsta spil í drawDeck
	def drawDeckdraw(self):
		if len(self.drawDeck) > 0: #ef við eigum spil eftir í drawDeck
			self.trashDeck.append(self.drawDeck.pop())
		elif self.difficulty > 0: #ef að við meigum nota spilin aftur
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
		
	#upfæra laus spil
	def updateRem(self,i,j):
		if j >= 1:
			self.pyramid[i-1][j-1][2][1]= -1
		if j!=i:
			self.pyramid[i-1][j][2][0]= -1	