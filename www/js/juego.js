
var DIAMETRO_BOLA = 50, // Declarar como variables globales para evitar posibles avisos de error.
    dificultad = 0,
    velocidadX = 0,
    velocidadY = 0,
    puntuacion = 0,
    tiempo = 20,
    alto,
    ancho,
    bola,
    objetivo,
    objetivo2,
    factorDificultad,  // De esta manera puedo parar el juego.
    scoreText,
    tiempoText;

var app={
  inicio: function(){

    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){
//    var estados = { preload: preload, create: create, update: update,render: render  };
    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
    
    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = '#f27d0c';
      game.load.image('bola', 'assets/bola.png');
      game.load.image('objetivo', 'assets/objetivo.png');
      game.load.image('objetivo2', 'assets/objetivo2.png');
    }

    function create() {
//    	game.time.events.add(Phaser.Timer.SECOND*20, nada, this);
      scoreText = game.add.text(ancho-120, 16, puntuacion, { fontSize: '50px', fill: '#757676' });
      tiempoText = game.add.text(32, 32, 'Tiempo: ' + tiempo, { fontSize: '20px', fill: '#ffff00' }); // Color amarillo.
     
      objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
        objetivo2 = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo2');
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
      
      game.physics.arcade.enable(bola);
      game.physics.arcade.enable(objetivo);
			game.physics.arcade.enable(objetivo2);
      bola.body.collideWorldBounds = true;
      bola.body.onWorldBounds = new Phaser.Signal();
      bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
        setInterval(bajarTiempo, 1000);
    }
    
      function bajarTiempo () {
          if (tiempo > 0) {
              tiempo -= 1
              tiempoText.text = 'Tiempo: ' + tiempo;
          } else {
              if (tiempo === 0) {
                  tiempo = -2;
                  nada();
              }
          }
      } 
      
/*    function render() {
    game.debug.text("Tiempo: " + Math.round(game.time.events.duration/1000), 32, 32);
 	}*/
    
    function nada() {
//        var linea;
        
        pararJuego(); // Parar la partida.

/*    	if(game.time.events.duration==0){*/
        alert('Game over');
/*        linea='Puntuacion: '+puntuacion+' puntos<br><button type="button" onclick="recomienza()">Empezar</button>'; Error se sale del juego.
        document.getElementById('tablon').innerHTML=linea;*/
        alert('Tus puntos: ' + puntuacion); //Para evitar salir de la función iniciaJuego, aquí está la clave ... no salirse del juego.
        nuevaPartida(); // Se comienza otra partida. No se recarga la página WEB.
//    	document.getElementById('tablon').innerHTML='Tu puntuación es de:'+puntuación+ 
//    		'';
//    		}
    }
      
    function pararJuego() {
        factorDificultad = 0; // Parar el juego.
        bola.position.x = -2 * DIAMETRO_BOLA; // Como si ocultases la bola.
    }
   
    function update(){
        var colores = [ "#f47c0b","#f48c0b","#f49c0b","#f4ac0b","#f4bc0b","#f4cc0b","#f4dc0b","#f4ec0b","#f4fc0b","#f4ff0b"]; 
        
        factorDificultad = (300 + (dificultad * 100));
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      
      game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
      game.physics.arcade.overlap(bola, objetivo2, app.incrementaPuntuacion2, null, this);
      if (bola.body.checkWorldBounds()) {
          game.stage.backgroundColor = "ff0000"; //  fondo rojo
      } else { game.stage.backgroundColor = colores[dificultad]; }
    }
    
    function nuevaPartida() {
        dificultad = 0;
        velocidadX = 0;
        velocidadY = 0;
        puntuacion = 0;    
        bola.position.x = app.inicioX();
        bola.position.y = app.inicioY();  
        objetivo.position.x = app.inicioX();
        objetivo.position.y = app.inicioY();        
        objetivo2.position.x = app.inicioX();
        objetivo2.position.y = app.inicioY();
        tiempo = 20;
        tiempoText.text = 'Tiempo: ' + tiempo;
    }
 
  },

  decrementaPuntuacion: function(){
    puntuacion = puntuacion-1;
    scoreText.text = puntuacion;
    if (dificultad>0)dificultad--;
  },

  incrementaPuntuacion: function(){
    puntuacion = puntuacion+5;
    scoreText.text = puntuacion;

    objetivo.position.x = app.inicioX();
    objetivo.position.y = app.inicioY();

    if (puntuacion > 0){
      dificultad = dificultad + 1;
    }
  },
  incrementaPuntuacion2: function(){
    puntuacion = puntuacion+10;
    scoreText.text = puntuacion;

    objetivo2.position.x = app.inicioX();
    objetivo2.position.y = app.inicioY();

    if (puntuacion > 0){
      dificultad = dificultad + 1;
    }
  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
        setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};


function empieza(){
	document.getElementById('tablon').innerHTML='';
if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}}