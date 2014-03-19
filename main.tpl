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
          <li><a href="/url">Reset game</a></li>
          <li><a href="/url">Undo last move</a></li>
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

    <div class="score">0</div>


<div class="decks">
    <div class="drawdeck">
        <div class="card hearts">
            <span class="value">5</span>
        </div>
    </div>

    <div class="trashdeck">

    </div>
</div>


    <div class="discard">

    </div>

    <div class="pyramid">

        <div class="row r1">

            <div class="card hearts">
                <span class="value">8</span>
            </div>

        </div>

        <div class="row r2">
            <div class="card spades">
                <span class="value">2</span>
            </div>
            <div class="card diamond">
                <span class="value">3</span>
            </div>
        </div>

        <div class="row r3">
            <div class="card spades">
                <span class="value">2</span>
            </div>
            <div class="card spades">
                <span class="value">2</span>
            </div>
            <div class="card spades">
                <span class="value">2</span>
            </div>
        </div>

        <div class="row r4">
            <div class="card spades">
                <span class="value">2</span>
            </div>
            <div class="card spades">
                <span class="value">2</span>
            </div>
            <div class="card spades">
                <span class="value">2</span>
            </div>
            <div class="card spades">
                <span class="value">2</span>
            </div>
        </div>

        <div class="row r5">
            <div class="card spades">
                <span class="value">2</span>
            </div>

            <div class="card spades">
                <span class="value">2</span>
            </div>

            <div class="card spades">
                <span class="value">2</span>
            </div>

            <div class="card spades">
                <span class="value">2</span>
            </div>

            <div class="card spades">
                <span class="value">2</span>
            </div>

        </div>

        <div class="row r6">
            <div class="card spades">
                <span class="value">2</span>
            </div>

            <div class="card spades">
                <span class="value">2</span>
            </div>

            <div class="card spades">
                <span class="value">2</span>
            </div>

            <div class="card spades">
                <span class="value">2</span>
            </div>

            <div class="card spades">
                <span class="value">2</span>
            </div>

            <div class="card spades">
                <span class="value">2</span>
            </div>
        </div>

        <div class="row r7">
            <div class="card spades">
                <span class="value">2</span>
            </div>
            <div class="card spades">
                <span class="value">2</span>
            </div>
            <div class="card spades free">
                <span class="value">2</span>
            </div>
            <div class="card spades">
                <span class="value">2</span>
            </div>
            <div class="card spades">
                <span class="value">2</span>
            </div>
            <div class="card spades">
                <span class="value">11</span>
            </div>
            <div class="card spades free">
                <span class="value">2</span>
            </div>
        </div>
    </div>

<script src="static/m.js"></script>
</body>
</html>