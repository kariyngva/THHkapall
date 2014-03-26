#coding=UTF-8
from datetime import datetime
import csv
import operator
# fall sem returnar top 10 highscores
def top10_highscores():
    try:
        with open('highscore.txt','rU') as highscore_skjal:
            highscore_skjal = csv.reader(highscore_skjal, delimiter='\t')

            scores=[]
            for row in highscore_skjal:
                scores.append([int(row[0]),str(row[1]),str(row[2])]) #baetum stigum og nafni i tvivitt fylki
            topScores = sorted(scores,key=operator.itemgetter(0), reverse=True) #rodum lista i ofuga rod(eftir stigum)
            top10list = topScores[:10] #top10list heldur utan um efstu 10 saetin, stig og nafn.
            return top10list
    except:
        return False
#fall sem skrifar score i skra sem geymir score
def input_score(score,name):
    f = open("highscore.txt",'a')
    f.write(str(score)+'\t'+str(name)+'\t'+str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))+'\n') #skrifum score, nafn og timasetningu i highscore.txt
    f.close()
#dæmi
#mafakka="turt"
#input_score(100,mafakka)

#topscore=top10_highscores()
#print topscore
