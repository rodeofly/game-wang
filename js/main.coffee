####################################################################################################
####################################################################################################
debug = false
cursor = 0 
bits = 1
lifes = 3
score = 0
randomize = false
n = Math.floor Math.pow(2,bits) *Math.random()

delay = (ms, func) -> setTimeout func, ms
interval = (ms, func) -> setInterval func, ms
# On Dom Ready !   
$ ->
  new_bridge = (tiles, randomize) ->
    for i in [tiles-1..0]
      weight = Math.pow(2, i)
      r = ['false','true']
      checked = if randomize then Math.floor(2*Math.random()) else 0
      alert "rand=#{randomize}, #{r[checked]}" if debug
      cbc  = "<div id='bridge#{i}' class='bridge-tile' data-weight='#{weight}' data-checked='#{r[checked]}'>#{weight}</div>"
      $( cbc )
        .css
          width : $( "#bridge" ).width() / tiles
          height : '100%'
        .appendTo $( "#bridge" )
        .show(1000)
        
  ####################################################################################################
  # Configuration des boites de dialogues
  ####################################################################################################
  $( "#bubble, #bubble-number" ).dialog
    autoOpen: false
    height : 50
    width: 'auto'
    show:
      effect: "blind"
      duration: 100
    hide:
      effect: "explode"
      duration: 100
    position: 
      my: "middle top"
      at: "middle top"
      of: "#ecran"
    open: (event, ui) -> setTimeout("$('#bubble').dialog('close')",2000)
  $( "#bubble-number" ).dialog
    position: 
      my: "right bottom"
      at: "left middle"
      of: "#hey"
  ####################################################################################################
  # Ecran de veille
  ####################################################################################################    
  $( "#bubble" ).html( "Press Game A or B button ! " )
  blink = interval 1500, -> $( "#bubble" ).dialog "open"
  
  go_veille = () ->
    $( "#bubble" ).html( "Press Game A or B button ! " )
    blink = interval 1500, -> $( "#bubble" ).dialog "open"
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
  get_binary = () ->
    binary = ""
    for i in [bits-1..0]
      if $( "#bridge#{i}" ).data( "checked" )
        binary += 1
      else
        binary += 0
    return binary
  is_marked = () ->
    switch cursor
      when -1
        $( "#bubble" ).text( "#{get_binary()}" )
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
          audioElement = document.getElementById('win-sound')
          audioElement.currentTime=0
          audioElement.play()
          ####################################################################################################
          $( "#bubble" ).html("Yeah ! #{binary} is #{n} !").dialog "open"
          score = score + n
          $( "#score" ).html("#{score}")
          bits = bits + 1
          $( ".bridge-tile" ).remove()
          new_bridge(bits, randomize)
          n = Math.floor Math.pow(2,bits) * Math.random()
          $( "#bubble-number" ).html("#{n}")
          i=1
          ringdabell = () ->
            i = i + 1
            $( "#hey" ).css
                "background" : "url('./img/Game&WatchSymbol#{i%2}.svg')"
                "background-size" : "100%"
            
          ringgit = interval 50, -> 
            ringdabell()
            audioElement = document.getElementById('bell-sound')
            audioElement.currentTime=0
            audioElement.play()
          delay 1000, -> 
            clearInterval ringgit
            $( "#hey" ).css
              "background" : "none"
        else
          ####################################################################################################
          audioElement = document.getElementById('fail-sound')
          audioElement.currentTime=0
          audioElement.play()
          ####################################################################################################
          $( "#bubble" ).html("Raah ! #{binary} is not #{n}<br>hint:#{n.toString(2)}").dialog "open"
          lifes = lifes - 1
          $( "#lifes img:first" ).remove()         
          if not lifes
            alert "game over"
            $( ".bridge-tile").remove()
            go_veille()
      else
        audioElement = document.getElementById('toggle-sound')
        audioElement.currentTime=0
        audioElement.play()
        $( "#bridge#{cursor}" ).data "checked", not $( "#bridge#{cursor}" ).data("checked")
        $( "#bridge#{cursor} input" ).prop 'checked', (i, v) -> !v
        $( "#checked-debug").text( "checked:#{$( "#bridge#{cursor}" ).data( "checked" )}" ) if debug
  ####################################################################################################
  # Assignation des boutons
  ####################################################################################################         
  $("#left").click -> move("left")
  $("#left-top").click -> is_marked()
  $("#right-top").click -> toggle()
  $("#right").click -> move("right")
  $("#time").click -> alert "Patience mon jeune Padawan !"
  
  ####################################################################################################
  # Post - Wang axiomes !
  #################################################################################################### 
  #(a) Marking the box he is in (assumed empty),                            toggle
  #(b) Erasing the mark in the box he is in (assumed marked),
  #(c) Moving to the box on his right,                                      move
  #(d) Moving to the box on his left,
  #(e) Determining whether the box he is in, is or is not marked.           is_marked
  ####################################################################################################
  # Game Start !
  ####################################################################################################    

  
  gogame = () ->
    clearInterval blink
    score = 0
    $( "#score" ).html("#{score}")
    bits = 1
    lifes = 3
    n = Math.floor Math.pow(2,bits) * Math.random()
    $( "#wang" ).remove()
    wang = "<div id='wang'></div>"
    ####################################################################################################
    # Configuration des ponderations de bit
    ####################################################################################################   
    $( "#lifes" ).empty()
    $( ".bridge-tile" ).remove()
    new_bridge(bits,randomize)
    for i in [1..lifes]
      life = "<img class='life'>"
      $( "#lifes" ).append( life )
    $( "#bridge#{cursor}" ).append $( wang )
    $( "#bubble-number" ).text("#{n}").dialog "open"
  
  $("#gameA").click ->
    randomize = false
    gogame()
  $("#gameB").click ->
    randomize = true
    gogame()
  
