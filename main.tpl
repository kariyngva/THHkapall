<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

  <title>Pyramid Solitare</title>
  <link href="static/m.css" rel="stylesheet" />
  <script src="static/jquery-1.11.0.min.js"></script>
  <script src="static/jquery-ui-1.10.4.custom.min.js"></script>
</head>

<body>

    <div class="topbar">
        <div>Score: <span class="score">{{ score }}</span></div>
        <div class="time">Time <span class="minutes">00</span>:<span class="seconds">00</span></div>
    </div>

%include nav.tpl


<div class="gamewrapper">
    <div class="decks">
        <div class="drawdeck">
            %if drawDeck != False:
                %if drawDeck.value > 9 or drawDeck.value == 1:
                    <div class="{{ cardClass }} card free {{ drawDeck.suit }} {{ drawDeck.rank }}">
                %else:
                    <div class="{{ cardClass }} card free {{ drawDeck.suit }}">
                %end
                <span class="value v1">{{ drawDeck.value }}</span>
                <span class="value v2">{{ drawDeck.value }}</span>
                <span class="rank">{{ drawDeck.rank }}</span>
                <!-- index ekkert notað hér - aðeins til að forðast JS villur -->
                <span class="index i">0</span>
                <span class="index j">0</span>
            </div>
            %end
        </div>

        <div class="trashdeck">
            %if len( activeDeck ) > 0:
                %activeDeckTop = activeDeck[-1]
                %if activeDeckTop.value > 9 or activeDeckTop.value == 1:
                    <div class="{{ cardClass }} card free {{ activeDeckTop.suit }} {{ activeDeckTop.rank }}">
                %else:
                    <div class="{{ cardClass }} card free {{ activeDeckTop.suit }}">
                %end
                    <span class="value v1">{{ activeDeckTop.value }}</span>
                    <span class="value v2">{{ activeDeckTop.value }}</span>
                    <span class="rank">{{ activeDeckTop.rank }}</span>
                    <!-- index ekkert notað hér - aðeins til að forðast JS villur -->
                    <span class="index i">0</span>
                    <span class="index j">0</span>
                </div>
            %end
        </div>
    </div>


    <div class="discard">

    </div>

    <div class="pyramid">

        %for i in range (0,7):
            <div class="row r{{ i }}">
            %for j in range ( 0, i + 1 ):
                %card = pyramid[i][j][0]
                %isgone = 'visible' if pyramid[i][j][3] is True else 'hidden'
                %if card.value > 9 or card.value == 1:
                    <div class="{{ cardClass }} card {{ card.suit }} {{ card.rank }} {{ isgone }}">
                %else:
                    <div class="{{ cardClass }} card {{ card.suit }} {{ isgone }}">
                %end
                    <span class="value v1">{{ card.value }}</span>
                    <span class="value v2">{{ card.value }}</span>
                    <span class="rank">{{ card.rank }}</span>
                    <span class="index i">{{ i }}</span>
                    <span class="index j">{{ j }}</span>
                </div>
            %end

            </div>
        %end

    </div>
</div>
<script src="static/m.js"></script>
</body>
</html>