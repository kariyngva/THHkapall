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

    <h2>Drawdeck</h2>
    <ul>
        %for i in range(0, len(pyramid.drawDeck)):
            %card = pyramid.drawDeck[i]
        <li>
            <span>[{{ card.suit }}]</span>
            <span>[{{ card.value }}]</span>
        </li>
        %end
    </ul>

    <hr class="stream" />

    <h2>activeDeck</h2>
    <ul>
        %for i in range(0, len(pyramid.activeDeck)):
            %card = pyramid.activeDeck[i]
        <li>
            <span>[{{ card.suit }}]</span>
            <span>[{{ card.value }}]</span>
        </li>
        %end
    </ul>

    <hr class="stream" />

    <h2>Píramídi</h2>
    <ul>
        %for i in range (0,7):
            %for j in range ( 0, i + 1 ):
            <li>
                %card = pyramid.pyramid[i][j][0]
                %isgone = 'visible' if pyramid.pyramid[i][j][3] is True else 'hidden'
                <span>[{{ card.suit }}]</span>
                <span>[{{ card.value }}]</span>
                <span>[{{ isgone }}]</span>
                <span class="index i">{{ i }}</span>
                <span class="index j">{{ j }}</span>
            </li>
            %end

        %end
    </ul>

    <h2>Discardpile</h2>
    <ul>
        %for i in range(0, len(pyramid.discardPile)):
            %card = pyramid.discardPile[i]
        <li>
            <span>[{{ card.suit }}]</span>
            <span>[{{ card.value }}]</span>
        </li>
        %end
    </ul>

<script src="static/m.js"></script>
</body>
</html>