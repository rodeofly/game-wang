####################################################################################################
# Variables Globales
####################################################################################################
[debug, cursor, bits, lifes, score, randomize, timer] = [false, -1, 1, 0, 0, false, false]
files = ["wang-dance0", "wang-dance1", "wang-left0", "wang-left1", "wang-right0", "wang-right1"]
n = Math.floor Math.pow(2,bits) * Math.random()
wang = "<div id='wang'></div>"
####################################################################################################
# Reecriture des fonctions setTimeOut et setInterval pour une utilisation simplifiee en coffeescript
####################################################################################################
delay = (ms, func) -> setTimeout func, ms
interval = (ms, func) -> setInterval func, ms
####################################################################################################
# Jouer un son
####################################################################################################   
play_diz = ( audio_id ) ->
  audioElement = document.getElementById( audio_id )
  audioElement.currentTime=0
  audioElement.play()
####################################################################################################
# Animation clochette
####################################################################################################   
checkit_baby = (timer) ->
  i=1
  ringgit = interval 50, -> 
    i = i + 1
    $( "#hey" ).css
        "background" : "url('./img/Game&WatchSymbol#{i%2}.svg')"
        "background-size" : "100%"     
    try
      play_diz( "bell-sound" )
    finally
      
  delay timer, -> 
    clearInterval ringgit
    $( "#hey" ).css {"background" : "none"}
bust_a_move = (timer) ->
  j=1       
  bustit = interval 200, -> 
    j = j + 1
    $( "#wang" ).css
      "background" : "url('./img/#{files[j%6]}.png')"
      "background-size" : "100%"   
  delay timer, -> 
    clearInterval bustit
####################################################################################################
# Obtenir la chaine binaire en cours
####################################################################################################   
get_binary = () ->
  binary = ""
  for i in [bits-1..0]
    if $( "#bridge#{i}" ).data( "checked" )
      binary += 1
    else
      binary += 0
  return binary
####################################################################################################
# Ecran de veille
####################################################################################################  
go_veille = () ->
  $( "#wang" ).remove()
  $( ".bridge-tile").remove()
  cursor = -1
  $( "#bridge-1" ).append $( wang )
  $( "#rules").html( "Emilio Posti doit additionner.<br>Il doit activer certains chiffres,<br>Puis valider le tout, en haut de son petit arbre !<br>Attention dans le jeu B...<br>Les chiffres sont validés au hasard.<br>Paré pour des additions...on the beat !?" )
####################################################################################################
# Construction du pont avec des chiffres activés ou non en fonction du jeu A ou B
####################################################################################################
new_bridge = (tiles, randomize) ->
    r = ['false','true']
    $( ".bridge-tile" ).remove()
    for i in [tiles-1..0]
      weight = Math.pow(2, i)
      checked = if randomize then Math.floor 2*Math.random() else 0
      aTile  = "<div id='bridge#{i}' class='bridge-tile' data-weight='#{weight}' data-checked='#{r[checked]}'>#{weight}</div>"
      $( aTile ).appendTo( $( "#bridge" )).css
        width : $( "#bridge" ).width() / tiles
        height : '100%'      
####################################################################################################
# On Dom Ready !   
####################################################################################################
$ ->
  ####################################################################################################
  # Configuration des boites de dialogues
  ####################################################################################################
  $( "#bubble" ).dialog
    autoOpen: false
    width: 'auto'
    hide:
      effect: "explode"
      duration: 100
    position: 
      my: "right bottom"
      at: "left top"
      of: "#wang"
    open: (event, ui) -> setTimeout("$('#bubble').dialog('close')",2000)
  $( "#bubble-number" ).dialog
    autoOpen: false
    height : 50
    width: 'auto'
    position: 
      my: "left top"
      at: "left top"
      of: "#ecran"
  ####################################################################################################
  # Mise en veille
  ####################################################################################################
  go_veille()
  blink = interval 1500, -> $( "#bubble" ).html( "Press Game A or B button ! " ).dialog "open"
  wang_dance = interval 250, ->
    $( "#wang" ).css
      "background" : "url('./img/#{files[Math.floor 6 * Math.random()]}.png')"
      "background-size" : "100%"   
  ####################################################################################################
  # Déplacements gauche & droite 
  ####################################################################################################
  move = (side) ->
    $( "#bubble" ).dialog "close"
    switch side
      when "left"
        if cursor isnt bits-1
          cursor = cursor + 1
          $( "#wang" ).css
            "background" : "no-repeat center url('./img/wang-left#{cursor%2}.png')"
            "background-size" : "100%"
        else
          $( "#bubble" ).html("!?").dialog "open"
      when "right"
        if cursor isnt -1
          cursor = cursor - 1
          $( "#wang" ).css
            "background" : "no-repeat center url('./img/wang-right#{Math.abs(cursor%2)}.png')"
            "background-size" : "100%"
        else
          $( "#bubble" ).html("!?").dialog "open" 
    $( "#wang" ).appendTo $( "#bridge#{cursor}" ) 
    $( "#cursor-debug" ).html( "cursor:#{cursor}" ) if debug
  #################################################################################################### 
  # Vérification : checked or not checked ?
  ####################################################################################################     
  is_marked = () ->
    switch cursor
      when -1
        $( "#bubble" ).html( "From here, I can see : #{get_binary()}<span style='font-size:0.5em;'>bin</span>" )
      else
        $( "#checked-debug").text( "checked:#{$( "#bridge#{cursor}" ).data( "checked" )}" ) if debug
        checked = if $( "#bridge#{cursor}" ).data( "checked" ) then "checked" else ""
        weight = $( "#bridge#{cursor}" ).data( 'weight' )
        $( "#bubble" ).html( "#{weight}&nbsp;<input type='checkbox' #{checked} disabled/>" )
    $( "#bubble" ).dialog "open"
  #################################################################################################### 
  # Bascule : check if not checked uncheck if checked + verification de la solution si au poids -1
  #################################################################################################### 
  toggle = () ->
    $( "#bubble" ).dialog "close"
    switch cursor
      when -1
        binary = get_binary()
        if n is parseInt binary, 2
          ####################################################################################################
          $( "#bubble" ).html("#{binary}<span style='font-size:0.5em;'>bin</span> is #{n}<span style='font-size:0.5em;'>dec</span> ! Yes !").dialog "open"
          score = score + n
          $( "#score" ).html("score:#{score} ou #{score.toString(2)}")
          bits = bits + 1
          n = Math.floor Math.pow(2,bits) * Math.random()
          $( "#bubble-number" ).html("Get #{n}<span style='font-size:0.5em;'>dec</span> !").dialog "open"
          new_bridge(bits, randomize)
          checkit_baby(1500)
          bust_a_move(1500)
        else
          ####################################################################################################
          $( "#bubble" ).html("Oh no ! It should be #{n.toString(2)}<span style='font-size:0.5em;'>bin</span> !").dialog "open"
          $( "#wang" ).css( {background : "no-repeat center url('./img/wang-sorry.png')", backgroundSize : "100%" } )
          lifes = lifes - 1
          $( "#lifes div:first" ).remove()         
          if not lifes
            alert "game over"
            go_veille()
            blink = interval 1500, -> $( "#bubble" ).html( "Press Game A or B button ! " ).dialog "open"
            wang_dance = interval 250, ->
              $( "#wang" ).css
                "background" : "url('./img/#{files[Math.floor 6 * Math.random()]}.png')"
                "background-size" : "100%"
          try
            play_diz( "fail-sound" )
          catch error
            checkit_baby(250)
          ####################################################################################################
      else
        $( "#bridge#{cursor}" ).data "checked", not $( "#bridge#{cursor}" ).data("checked")
        $( "#bridge#{cursor} input" ).prop 'checked', (i, v) -> !v
        $( "#checked-debug").text( "checked:#{$( "#bridge#{cursor}" ).data( "checked" )}" ) if debug
        try
          play_diz( "toggle-sound" )
        catch error
          checkit_baby(250)
  ####################################################################################################
  # Post - Wang axiomes !
  #################################################################################################### 
  #(a) Marking the box he is in (assumed empty),                            toggle
  #(b) Erasing the mark in the box he is in (assumed marked),
  #(c) Moving to the box on his right,                                      move
  #(d) Moving to the box on his left,
  #(e) Determining whether the box he is in, is or is not marked.           is_marked
  ####################################################################################################
  # Assignation des boutons
  ####################################################################################################         
  $("#left").click -> move("left")
  $("#left-top").click -> is_marked()
  $("#right-top").click -> toggle()
  $("#right").click -> move("right")
  $("#time").click -> alert "Patience mon jeune Padawan !"
  ####################################################################################################
  # Game Start !
  ####################################################################################################     
  gogame = () ->
    clearInterval blink
    clearInterval wang_dance
    $( "#lifes" ).empty()
    $( "#rules").html( "")
    [cursor, score, lifes, bits] = [-1, 0, 3, 1]
    n = Math.floor Math.pow(2,bits) * Math.random()
    $( "#score" ).html("score:#{score}") 
    ####################################################################################################
    # Configuration des ponderations de bit
    ####################################################################################################   
    new_bridge(bits,randomize)
    for i in [1..lifes]
      life = "<div class='life'> </div>"
      $( "#lifes" ).append( life )
    $( "#bubble-number" ).html("Get #{n}<span style='font-size:0.5em;'>dec</span> !").dialog "open"
  
  $("#gameA").click ->
    randomize = false
    gogame()
  $("#gameB").click ->
    randomize = true
    gogame()
