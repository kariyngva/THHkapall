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
    %include nav.tpl
    <h2>Highscore</h2>
    <ul>
        %for score in scores:
            
        <li>
            <span>{{ score[0] }}</span>
            <span>{{ score[1] }}</span>
            <span>{{ score[2] }}</span>
        </li>
        %end
    </ul>

    
<script src="static/m.js"></script>
</body>
</html>