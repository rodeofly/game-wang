// Generated by CoffeeScript 1.9.0
(function() {
  var bits, bust_a_move, checkit_baby, cursor, debug, delay, files, get_binary, go_veille, interval, lifes, n, new_bridge, play_diz, randomize, score, timer, wang, _ref;

  _ref = [false, -1, 1, 0, 0, false, false], debug = _ref[0], cursor = _ref[1], bits = _ref[2], lifes = _ref[3], score = _ref[4], randomize = _ref[5], timer = _ref[6];

  files = ["wang-dance0", "wang-dance1", "wang-left0", "wang-left1", "wang-right0", "wang-right1"];

  n = Math.floor(Math.pow(2, bits) * Math.random());

  wang = "<div id='wang'></div>";

  delay = function(ms, func) {
    return setTimeout(func, ms);
  };

  interval = function(ms, func) {
    return setInterval(func, ms);
  };

  play_diz = function(audio_id) {
    var audioElement;
    audioElement = document.getElementById(audio_id);
    audioElement.play();
    return audioElement.currentTime = 0;
  };

  checkit_baby = function(timer) {
    var i, ringgit;
    i = 1;
    ringgit = interval(100, function() {
      i = i + 1;
      return $("#hey").css({
        "background": "url('./img/Game&WatchSymbol" + (i % 2) + ".svg')",
        "background-size": "100%"
      });
    });
    return delay(timer, function() {
      clearInterval(ringgit);
      return $("#hey").css({
        "background": "none"
      });
    });
  };

  bust_a_move = function(timer) {
    var bustit, j;
    j = 1;
    bustit = interval(200, function() {
      j = j + 1;
      return $("#wang").css({
        "background": "url('./img/" + files[j % 6] + ".png')",
        "background-size": "100%"
      });
    });
    return delay(timer, function() {
      return clearInterval(bustit);
    });
  };

  get_binary = function() {
    var binary, i, _i, _ref1;
    binary = "";
    for (i = _i = _ref1 = bits - 1; _ref1 <= 0 ? _i <= 0 : _i >= 0; i = _ref1 <= 0 ? ++_i : --_i) {
      if ($("#bridge" + i).data("checked")) {
        binary += 1;
      } else {
        binary += 0;
      }
    }
    return binary;
  };

  go_veille = function() {
    $("#wang").remove();
    $(".bridge-tile").remove();
    cursor = -1;
    $("#bridge-1").append($(wang));
    return $("#rules").html("<br><br><br>Emilio Posti doit trouver un nombre en additionnant certains chiffres.<br>Puis valider le tout, en haut de son petit arbre !<br>[?] permet de savoir si un chiffre est selectionné ou d'avoir une vue d'ensemble depuis le petit arbre !<br>[V] permet de (dé)selectionner un chiffre.<br>Attention dans le jeu B les chiffres sont validés au hasard.<br>Paré pour des additions...on the beat !?");
  };

  new_bridge = function(tiles, randomize) {
    var aTile, checked, easy, i, r, weight, _i, _ref1, _results;
    r = ['false', 'true'];
    $(".bridge-tile").remove();
    _results = [];
    for (i = _i = _ref1 = tiles - 1; _ref1 <= 0 ? _i <= 0 : _i >= 0; i = _ref1 <= 0 ? ++_i : --_i) {
      weight = Math.pow(2, i);
      checked = randomize ? Math.floor(2 * Math.random()) : 0;
      easy = "";
      if (!randomize) {
        easy = "<input type='checkbox' " + checked + " disabled/>";
      }
      aTile = "<div id='bridge" + i + "' class='bridge-tile' data-weight='" + weight + "' data-checked='" + r[checked] + "'><span class='bridge-weight'>" + weight + "</span>" + easy + "</div>";
      _results.push($(aTile).appendTo($("#bridge")).css({
        width: $("#bridge").width() / tiles,
        height: '100%',
        top: "-10*" + i + "px"
      }));
    }
    return _results;
  };

  $(function() {
    var audio, blink, gogame, is_marked, move, name, toggle, wang_dance, _i, _len, _ref1;
    _ref1 = ["bell", "fail", "toggle"];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      name = _ref1[_i];
      audio = $("#" + name + "-sound");
      audio.attr('src', Modernizr.audio.ogg ? "./sounds/" + name + ".ogg" : Modernizr.audio.mp3 ? "./sounds/" + name + ".mp3" : "./sounds/" + name + ".wav");
    }
    $("#bubble").dialog({
      autoOpen: false,
      width: 'auto',
      hide: {
        effect: "explode",
        duration: 100
      },
      position: {
        my: "right top",
        at: "left bottom",
        of: "#wang"
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
        my: "left top",
        at: "left top",
        of: "#ecran"
      }
    });
    go_veille();
    blink = interval(1500, function() {
      return $("#bubble").html("Press Game A or B button ! ").dialog("open");
    });
    wang_dance = interval(250, function() {
      return $("#wang").css({
        "background": "url('./img/" + files[Math.floor(6 * Math.random())] + ".png')",
        "background-size": "100%"
      });
    });
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
    is_marked = function() {
      var checked, weight;
      switch (cursor) {
        case -1:
          $("#bubble").html("From here, I can see : " + (get_binary()) + "<span style='font-size:0.5em;'>bin</span>");
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
      var binary, error;
      $("#bubble").dialog("close");
      switch (cursor) {
        case -1:
          binary = get_binary();
          if (n === parseInt(binary, 2)) {
            $("#bubble").html(binary + "<span style='font-size:0.5em;'>bin</span> is " + n + "<span style='font-size:0.5em;'>dec</span> ! Yes !").dialog("open");
            score = score + n;
            $("#score").html("score:" + score + " ou " + (score.toString(2)));
            bits = bits + 1;
            n = Math.floor(Math.pow(2, bits) * Math.random());
            $("#bubble-number").html("Get " + n + "<span style='font-size:0.5em;'>dec</span> !").dialog("open");
            new_bridge(bits, randomize);
            try {
              return play_diz("bell-sound");
            } finally {
              checkit_baby(1000);
              bust_a_move(1000);
            }
          } else {
            $("#bubble").html("Oh no ! It should be " + (n.toString(2)) + "<span style='font-size:0.5em;'>bin</span> !").dialog("open");
            $("#wang").css({
              background: "no-repeat center url('./img/wang-sorry.png')",
              backgroundSize: "100%"
            });
            lifes = lifes - 1;
            $("#lifes div:first").remove();
            if (!lifes) {
              alert("game over");
              go_veille();
              blink = interval(1500, function() {
                return $("#bubble").html("Press Game A or B button ! ").dialog("open");
              });
              wang_dance = interval(250, function() {
                return $("#wang").css({
                  "background": "url('./img/" + files[Math.floor(6 * Math.random())] + ".png')",
                  "background-size": "100%"
                });
              });
            }
            try {
              return play_diz("fail-sound");
            } catch (_error) {
              error = _error;
              return checkit_baby(250);
            }
          }
          break;
        default:
          $("#bridge" + cursor).data("checked", !$("#bridge" + cursor).data("checked"));
          $("#bridge" + cursor + " input").prop('checked', function(i, v) {
            return !v;
          });
          if (debug) {
            $("#checked-debug").text("checked:" + ($("#bridge" + cursor).data("checked")));
          }
          try {
            return play_diz("toggle-sound");
          } catch (_error) {
            error = _error;
            return checkit_baby(250);
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
      var i, life, _j, _ref2;
      clearInterval(blink);
      clearInterval(wang_dance);
      $("#wang").remove();
      cursor = -1;
      $("#bridge-1").append($(wang));
      $("#lifes").empty();
      $("#rules").html("");
      _ref2 = [-1, 0, 3, 1], cursor = _ref2[0], score = _ref2[1], lifes = _ref2[2], bits = _ref2[3];
      n = Math.floor(Math.pow(2, bits) * Math.random());
      $("#score").html("score:" + score);
      new_bridge(bits, randomize);
      for (i = _j = 1; 1 <= lifes ? _j <= lifes : _j >= lifes; i = 1 <= lifes ? ++_j : --_j) {
        life = "<div class='life'> </div>";
        $("#lifes").append(life);
      }
      return $("#bubble-number").html("Get " + n + "<span style='font-size:0.5em;'>dec</span> !").dialog("open");
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
