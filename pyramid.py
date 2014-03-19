from Card import *
from Deck import *

class Pyramid:

	def __init__(self, difficulty):
		self.deck = Deck() #stokkurinn
		self.pyramid = self.buildPyr() #hluti af stokknum ver�ur p�ram�ddi
		self.drawDeck = [] #fyrri stokkurinn af spilum
		self.trashDeck = []	#seinni stokkurinn af spilum
		self.discardPile = [] #spilin sem a� hafa veri� tekin �t
		for i in range(0,len(self.deck.cards)):
			self.drawDeck.append(self.deck.draw())
		self.score = 0
		self.difficulty = difficulty #�v� h�rri tala �v� au�veldari er leikurinn
		self.tempPyramid = [] #state savefyrir restart same game
		for i in range(len(self.pyramid)):
			self.tempPyramid.append(self.pyramid[i])
		self.tempDrawDeck = []#state savefyrir restart same game
		for i in range(len(self.drawDeck)):
			self.tempDrawDeck.append(self.drawDeck[i])
	
	#byggir p�ram�dann sj�lfann sem lista af listum
	#hvert stak � listunum inniheldur spil og hnit fyrir foreldri og b�rn sbr. tr�
	def buildPyr(self):
	  """ 
	  returns list of lists, each inner list containing one level of pyramid
	  [[[h0_0]],[[h1_0],[h1_1]], ...]
	  """
	  pyr = [] #t�mabundin breyta

	  for i in range (0,7): #sex h��ir
		thisLevel = [] #hver h��
	  
		for j in range (0,i+1):
		  nxtCard = self.deck.draw() # or whatever you get the idea
		  pyrSpotSpecs = [nxtCard, self.parents(i,j), self.children(i,j)] #hver eind
		  thisLevel.append(pyrSpotSpecs)

		pyr.append(thisLevel)
	  return pyr
	
	#dregur spil �r bunka og setur �a� � trashdeck
	#�� s�st n�sta spil � drawDeck
	def drawDeckdraw(self):
		if len(self.drawDeck) > 0: #ef vi� eigum spil eftir � drawDeck
			self.trashDeck.append(self.drawDeck.pop())
		elif self.difficulty > 0: #ef a� vi� meigum nota spilin aftur
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
		
	#athuga hvort spili� er laust	
	def checkFree(self,i, j):
	  if self.pyramid[i][j][2] == [-1,-1]:
		return True
	  else:
		return False
		
	#upf�ra laus spil
	def updateRem(self,i,j):
		if j >= 1:
			self.pyramid[i-1][j-1][2][1]= -1
		if j!=i:
			self.pyramid[i-1][j][2][0]= -1	