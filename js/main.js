// Generated by CoffeeScript 1.9.0
(function() {
  var bits, cursor, debug, delay, lifes, n, score;

  debug = false;

  cursor = 0;

  bits = 1;

  lifes = 3;

  score = 0;

  n = Math.floor(Math.pow(2, bits) * Math.random());

  delay = function(ms, func) {
    return setTimeout(func, ms);
  };

  $(function() {
    var get_binary, is_marked, move, new_bridge, toggle;
    new_bridge = function(tiles) {
      var cbc, i, weight, _i, _ref, _results;
      _results = [];
      for (i = _i = _ref = tiles - 1; _ref <= 0 ? _i <= 0 : _i >= 0; i = _ref <= 0 ? ++_i : --_i) {
        weight = Math.pow(2, i);
        cbc = "<div id='bridge" + i + "' class='bridge-tile' data-weight='" + weight + "' data-checked='false'>" + weight + "</div>";
        _results.push($(cbc).css({
          width: $("#bridge").width() / tiles,
          height: '100%'
        }).appendTo($("#bridge")).show(1000));
      }
      return _results;
    };
    $("#bubble, #bubble-number").dialog({
      autoOpen: false,
      height: 50,
      width: 'auto',
      show: {
        effect: "blind",
        duration: 100
      },
      hide: {
        effect: "explode",
        duration: 100
      },
      position: {
        my: "middle top",
        at: "middle top",
        of: "#ecran"
      },
      open: function(event, ui) {
        return setTimeout("$('#bubble').dialog('close')", 2000);
      }
    });
    $("#bubble-number").dialog({
      position: {
        my: "right bottom",
        at: "left middle",
        of: "#hey"
      }
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
      var audioElement, binary, i;
      $("#bubble").dialog("close");
      switch (cursor) {
        case -1:
          binary = get_binary();
          if (n === parseInt(binary, 2)) {
            audioElement = document.getElementById('win-sound');
            audioElement.currentTime = 0;
            audioElement.play();
            $("#bubble").html("Yeah ! " + binary + " is " + n + " !").dialog("open");
            score = score + n;
            $("#score").html("" + score);
            bits = bits + 1;
            $(".bridge-tile").remove();
            new_bridge(bits);
            n = Math.floor(Math.pow(2, bits) * Math.random());
            $("#bubble-number").html("" + n);
            i = 1;
            return delay(500, function() {
              $("#hey").css({
                "background": "url('./img/Game&WatchSymbol" + (i % 2) + ".svg')",
                "background-size": "100%"
              });
              i = i + 1;
              return delay(500, function() {
                $("#hey").css({
                  "background": "url('./img/Game&WatchSymbol" + (i % 2) + ".svg')",
                  "background-size": "100%"
                });
                i = i + 1;
                return delay(500, function() {
                  $("#hey").css({
                    "background": "url('./img/Game&WatchSymbol" + (i % 2) + ".svg')",
                    "background-size": "100%"
                  });
                  return i = i + 1;
                });
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
              return $(".bridge-tile").remove();
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
    $("#gameB, #time").click(function() {
      return alert("Patience mon jeune Padawan !");
    });
    return $("#gameA").click(function() {
      var i, life, wang, _i;
      bits = 1;
      lifes = 3;
      n = Math.floor(Math.pow(2, bits) * Math.random());
      $("#wang").remove();
      wang = "<div id='wang'></div>";
      $("#lifes").empty();
      $(".bridge-tile").remove();
      new_bridge(bits);
      for (i = _i = 1; 1 <= lifes ? _i <= lifes : _i >= lifes; i = 1 <= lifes ? ++_i : --_i) {
        life = "<img class='life'>";
        $("#lifes").append(life);
      }
      $("#bridge" + cursor).append($(wang));
      return $("#bubble-number").text("" + n).dialog("open");
    });
  });

}).call(this);
