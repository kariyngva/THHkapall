from datetime import datetime
import csv

# fall sem returnar top 10 highscores
def top10_highscore():
    try:
        with open('highscore.txt','rU') as highscore_skjal:
            highscore_skjal = csv.reader(highscore_skjal, delimiter='\t')
            scores = (int(row[0]) for row in highscore_skjal) #lesum oll scores i lista
            topScores = sorted(scores, reverse=True) #rodum lista i ofugarod
            top10list = topScores[:10] #top10list heldur utan um efstu 10 stokin
            return top10list
    except:
        return False

def input_score(score,name):
    f = open("highscore.txt",'a')
    f.write(str(score)+'\t'+str(name)+'\t'+str(datetime.now())+'\n') #skrifum score, nafn og timasetningu i highscore.txt
    f.close()


#input_score(600,"tms")

#topscore=top10_highscore()
#print topscore
