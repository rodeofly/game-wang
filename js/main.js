// Generated by CoffeeScript 1.9.0
(function() {
  var bits, cursor, debug, delay, interval, lifes, n, new_bridge, randomize, score, timer, wang;

  debug = false;

  cursor = 0;

  bits = 1;

  lifes = 3;

  score = 0;

  randomize = false;

  timer = false;

  n = Math.floor(Math.pow(2, bits) * Math.random());

  wang = "<div id='wang'></div>";

  delay = function(ms, func) {
    return setTimeout(func, ms);
  };

  interval = function(ms, func) {
    return setInterval(func, ms);
  };

  new_bridge = function(tiles, randomize) {
    var cbc, checked, i, r, weight, _i, _ref, _results;
    r = ['false', 'true'];
    _results = [];
    for (i = _i = _ref = tiles - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
      weight = Math.pow(2, i);
      checked = randomize ? Math.floor(2 * Math.random()) : 0;
      cbc = "<div id='bridge" + i + "' class='bridge-tile' data-weight='" + weight + "' data-checked='" + r[checked] + "'>" + weight + "</div>";
      _results.push($(cbc).appendTo($("#bridge")).css({
        width: $("#bridge").width() / tiles,
        height: '100%'
      }));
    }
    return _results;
  };

  $(function() {
    var blink, get_binary, go_veille, gogame, is_marked, move, toggle;
    $("#bridge-1").append($(wang));
    $("#bubble").html("Press Game A or B button !");
    $("#rules").html("Emilio Posti doit additionner !<br>Il doit activer certains chiffres,<br>Puis valider le tout, en haut de son petit arbre !<br>Attention dans le jeu B...<br>Les chiffres sont validés au hasard.<br>Paré pour des additions...on the beat !?");
    blink = interval(1500, function() {
      return $("#bubble").dialog("open");
    });
    $("#bubble").dialog({
      autoOpen: false,
      width: 'auto',
      hide: {
        effect: "explode",
        duration: 100
      },
      position: {
        my: "center bottom",
        at: "center bottom",
        of: "#ecran"
      },
      open: function(event, ui) {
        return setTimeout("$('#bubble').dialog('close')", 2000);
      }
    });
    $("#bubble-number").dialog({
      autoOpen: false,
      height: 50,
      width: 'auto',
      position: {
        my: "right bottom",
        at: "left middle",
        of: "#hey"
      }
    });
    go_veille = function() {
      $("#bubble").html("Press Game A or B button ! ");
      $("#rules").html("Emilio Posti doit additionner.<br>Il doit activer certains chiffres,<br>Puis valider le tout, en haut de son petit arbre !<br>Attention dans le jeu B...<br>Les chiffres sont validés au hasard.<br>Paré pour des additions...on the beat !?");
      return blink = interval(1500, function() {
        return $("#bubble").dialog("open");
      });
    };
    move = function(side) {
      $("#bubble").dialog("close");
      switch (side) {
        case "left":
          if (cursor !== bits - 1) {
            cursor = cursor + 1;
            $("#wang").css({
              "background": "no-repeat center url('./img/wang-left" + (cursor % 2) + ".png')",
              "background-size": "100%"
            });
          } else {
            $("#bubble").html("!?").dialog("open");
          }
          break;
        case "right":
          if (cursor !== -1) {
            cursor = cursor - 1;
            $("#wang").css({
              "background": "no-repeat center url('./img/wang-right" + (Math.abs(cursor % 2)) + ".png')",
              "background-size": "100%"
            });
          } else {
            $("#bubble").html("!?").dialog("open");
          }
      }
      $("#wang").appendTo($("#bridge" + cursor));
      if (debug) {
        return $("#cursor-debug").html("cursor:" + cursor);
      }
    };
    get_binary = function() {
      var binary, i, _i, _ref;
      binary = "";
      for (i = _i = _ref = bits - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
        if ($("#bridge" + i).data("checked")) {
          binary += 1;
        } else {
          binary += 0;
        }
      }
      return binary;
    };
    is_marked = function() {
      var checked, weight;
      switch (cursor) {
        case -1:
          $("#bubble").text("" + (get_binary()));
          break;
        default:
          if (debug) {
            $("#checked-debug").text("checked:" + ($("#bridge" + cursor).data("checked")));
          }
          checked = $("#bridge" + cursor).data("checked") ? "checked" : "";
          weight = $("#bridge" + cursor).data('weight');
          $("#bubble").html(weight + "&nbsp;<input type='checkbox' " + checked + " disabled/>");
      }
      return $("#bubble").dialog("open");
    };
    toggle = function() {
      var audioElement, binary, i, ringdabell, ringgit;
      $("#bubble").dialog("close");
      switch (cursor) {
        case -1:
          binary = get_binary();
          if (n === parseInt(binary, 2)) {
            audioElement = document.getElementById('win-sound');
            audioElement.currentTime = 0;
            audioElement.play();
            score = score + n;
            bits = bits + 1;
            n = Math.floor(Math.pow(2, bits) * Math.random());
            $("#bubble-number").html("" + n);
            $("#bubble").html("Yeah ! " + binary + " is " + n + " !").dialog("open");
            $("#score").html("" + score);
            $(".bridge-tile").remove();
            new_bridge(bits, randomize);
            i = 1;
            ringdabell = function() {
              i = i + 1;
              return $("#hey").css({
                "background": "url('./img/Game&WatchSymbol" + (i % 2) + ".svg')",
                "background-size": "100%"
              });
            };
            ringgit = interval(50, function() {
              ringdabell();
              audioElement = document.getElementById('bell-sound');
              audioElement.currentTime = 0;
              return audioElement.play();
            });
            return delay(1000, function() {
              clearInterval(ringgit);
              return $("#hey").css({
                "background": "none"
              });
            });
          } else {
            audioElement = document.getElementById('fail-sound');
            audioElement.currentTime = 0;
            audioElement.play();
            $("#bubble").html("Raah ! " + binary + " is not " + n + "<br>hint:" + (n.toString(2))).dialog("open");
            lifes = lifes - 1;
            $("#lifes img:first").remove();
            if (!lifes) {
              alert("game over");
              $(".bridge-tile").remove();
              return go_veille();
            }
          }
          break;
        default:
          audioElement = document.getElementById('toggle-sound');
          audioElement.currentTime = 0;
          audioElement.play();
          $("#bridge" + cursor).data("checked", !$("#bridge" + cursor).data("checked"));
          $("#bridge" + cursor + " input").prop('checked', function(i, v) {
            return !v;
          });
          if (debug) {
            return $("#checked-debug").text("checked:" + ($("#bridge" + cursor).data("checked")));
          }
      }
    };
    $("#left").click(function() {
      return move("left");
    });
    $("#left-top").click(function() {
      return is_marked();
    });
    $("#right-top").click(function() {
      return toggle();
    });
    $("#right").click(function() {
      return move("right");
    });
    $("#time").click(function() {
      return alert("Patience mon jeune Padawan !");
    });
    gogame = function() {
      var i, life, _i;
      score = 0;
      lifes = 3;
      bits = 1;
      n = Math.floor(Math.pow(2, bits) * Math.random());
      clearInterval(blink);
      $("#lifes").empty();
      $("#rules").html("");
      $("#score").html("" + score);
      $("#wang").remove();
      wang = "<div id='wang'></div>";
      $(".bridge-tile").remove();
      new_bridge(bits, randomize);
      for (i = _i = 1; 1 <= lifes ? _i <= lifes : _i >= lifes; i = 1 <= lifes ? ++_i : --_i) {
        life = "<img class='life'>";
        $("#lifes").append(life);
      }
      $("#bridge" + cursor).append($(wang));
      return $("#bubble-number").text("" + n).dialog("open");
    };
    $("#gameA").click(function() {
      randomize = false;
      return gogame();
    });
    return $("#gameB").click(function() {
      randomize = true;
      return gogame();
    });
  });

}).call(this);
