#coding=UTF-8
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
		self.initPyramid = [] #state savefyrir restart same game
		for i in range(len(self.pyramid)):
			self.initPyramid.append(self.pyramid[i])
		self.initDrawDeck = []#state savefyrir restart same game
		for i in range(len(self.drawDeck)):
			self.initDrawDeck.append(self.drawDeck[i])
		self.initDifficulty = self.difficulty
		self.tempPyramid = []
		self.tempDrawDeck = []
		self.tempDiscardpile = []
	
	#byggir píramídann sjálfann sem lista af listum
	#hvert stak í listunum inniheldur spil og hnit fyrir foreldri og börn sbr. tré
	def buildPyr(self):
		pyr = [] #tímabundin breyta

		for i in range (0,7): #sex hæðir
			thisLevel = []
			for j in range (0,i+1):
			  nxtCard = self.deck.draw() # or whatever you get the idea
			  pyrSpotSpecs = [nxtCard, self.parents(i,j), self.children(i,j)] #hver eind
			  thisLevel.append(pyrSpotSpecs)

			pyr.append(thisLevel)
		return pyr
	
	def saveState(self):
		self.tempPyramid = list(self.pyramid)
		self.tempDrawDeck = list(self.drawDeck)
		self.tempDiscardpile = list(self.discardPile)
		self.tempTrashDeck = list(self.trashDeck)
		self.tempDifficulty = self.difficulty
		
	def returnToInit(self):
		self.pyramid = list(self.initPyramid)
		self.drawDeck = list(self.initDrawDeck)
		self.trashDeck = []
		self.difficulty = self.initDifficulty
		self.discardPile = []
		
	def Undo(self):
		self.pyramid = list(self.tempPyramid)
		self.drawDeck = list(self.tempDrawDeck)
		self.discardPile = list(self.tempDiscardpile)
		self.trashDeck = list(self.tempTrashDeck)
		self.difficulty = self.tempDifficulty
		
	#dregur spil úr bunka og setur það í trashdeck
	#þá sést næsta spil í drawDeck
	def drawDeckdraw(self):
		#self.saveState()
		if len(self.drawDeck) > 0: #ef við eigum spil eftir í drawDeck
			self.trashDeck.append(self.drawDeck.pop(-1))
		elif self.difficulty > 0: #ef að við meigum nota spilin aftur
			for i in range(len(trashDeck)):
				drawDeck.append(trashDeck.pop())
				difficulty = difficulty -1
		else:
			return -1
			
		
		
	#hnit foreldra: -1 er enginn
	def parents(self, i,j):
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
		
	# athugar spil dregið frá píramídda á annað spil í píramídda
	#i1 og j1 er hnit fyrir spilið sem er verið að draga
	#i2 og j2 eru hnitin fyrir spilið sem verið er að droppa á
	def pyramidToPyramid(self, i1, j1, i2, j2):
		if self.checkFree(i2, j2):
			if self.pyramid[i1][j1][0].value + self.pyramid[i2][j2][0].value == 13:
				#self.saveState()
				self.updateRem(i1, j1)
				self.updateRem(i2, j2)
				self.discardPile.append(self.pyramid[i1][j1][0])
				self.discardPile.append(self.pyramid[i2][j2][0])
				return True
			return False
		return False
		
	# athugar spil sem tekið er af öðrum hvorum stokknum og sleppt á píramídda
	#fromDraw er boolean gildi sem að er rétt þegar spilið kemur úr drawDeck
	# i og j eru hnit af spilinu sem verið er að sleppa á, card er spilið úr stokknum
	def deckToPyramid(self, fromDraw, card, i, j):
		if self.checkFree(i, j):
			if card.value + self.pyramid[i][j][0].value == 13:
				#self.saveState()
				self.updateRem(i, j)
				self.discardPile.append(self.pyramid[i][j][0])
				if fromDraw:
					self.discardPile.append(drawDeck.pop)
				else:
					self.discardPile.append(trashDeck.pop)
				return True
			return False
		return False
		