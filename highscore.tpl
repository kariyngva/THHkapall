<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

  <title>Highscore</title>
  <link href="static/m.css" rel="stylesheet" />
  <script src="static/jquery-1.11.0.min.js"></script>
  <script src="static/jquery-ui-1.10.4.custom.min.js"></script>
</head>
<body class="highscore">
    %include nav.tpl
    <h2>Highscore</h2>
    %if scores != False:
      <ul>
          %for score in scores:
          <li>
              <span>{{ score[0] }}</span>
              <span>{{ score[1] }}</span>
              <!--span>{{ score[2] }}</span-->
          </li>
          %end
      </ul>
    %else:
      <p>Ekki tókst að hlaða highscore. :/</p>
    %end


<script src="static/m.js"></script>
</body>
</html>