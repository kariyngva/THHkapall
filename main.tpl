<!DOCTYPE html>

<!--[if lt IE 9]>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" class="msie"><![endif]--><!--[if gte IE 9]><!-->
<html xmlns="http://www.w3.org/1999/xhtml" lang="en"><!--<![endif]-->
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

  <title></title>
  <link href="static/m.css" rel="stylesheet" />
  <script src="static/jquery-1.11.0.min.js"></script>
  <script src="static/jquery-ui-1.10.4.custom.min.js"></script>

</head>
<body>

    <div class="nav">
        <ul>
          <li><a href="/newgame">New game</a></li>
          <li><a href="/resetgame">Reset game</a></li>
          <li><a href="/undolastmove">Undo last move</a></li>
          <li class="difficulty">
            <span>Set difficulty</span>
            <ul>
              <li><a href="/setDifficulty/easy">Easy</a></li>
              <li><a href="/setDifficulty/normal">Normal</a></li>
              <li><a href="/setDifficulty/hard">Hard</a></li>
            </ul>
          </li>
        </ul>
    </div>

    <div class="score">{{ score }}</div>


<div class="decks">
    <div class="drawdeck">
        <div class="card free {{ drawDeck.suit }}">
            <span class="value v1">{{ drawDeck.value }}</span>
            <span class="value v2">{{ drawDeck.value }}</span>
            <span class="rank">{{ drawDeck.rank }}</span>
            <!-- index ekkert notað hér - aðeins til að forðast JS villur -->
            <span class="index i">0</span>
            <span class="index j">0</span>
        </div>
    </div>

    <div class="trashdeck">
        %if len( activeDeck ) > 0:
            <div class="card free {{ activeDeck[-1].suit }}">
                <span class="value">{{ activeDeck[-1].value }}</span>
                <span class="rank">{{ activeDeck[-1].rank }}</span>
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
                %isgone = '' if pyramid[i][j][3] is True else 'hidden'
                %if card.value > 10:
                    <div class="card {{ card.suit }} {{ card.rank }} {{ isgone }}">
                %else:
                    <div class="card {{ card.suit }} {{ isgone }}">
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

<script src="static/m.js"></script>
</body>
</html>