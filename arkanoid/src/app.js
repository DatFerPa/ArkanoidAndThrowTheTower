
var numBloquesGlobal = 0;
var velocidadPelotaX = 0;
var velocidadPelotaY = 0;

var GameLayer = cc.Layer.extend({
    spritePelota:null,
    spriteBarra:null,
    keyPulsada: null,
    velocidadX:null,
    velocidadY:null,
    spriteBloque:null,
    numeroBloques:null,
    arrayBloques:[],
    ctor:function () {
        this._super();

        console.log("Ejecutada gameLayer");
        var size = cc.winSize;

        // cachear
        cc.spriteFrameCache.addSpriteFrames(res.animacioncocodrilo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacionpanda_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animaciontigre_plist);

        this.numeroBloques = numBloquesGlobal + Math.floor(Math.random()*10);
        numBloquesGlobal = this.numeroBloques;

        this.velocidadX = velocidadPelotaX + Math.floor(Math.random()*(6)+1);
        this.velocidadY = velocidadPelotaY + Math.floor(Math.random()*(3)+1);

        velocidadPelotaX = this.velocidadX;
        velocidadPelotaY = this.velocidadY;


        console.log("Bloques globales : "+numBloquesGlobal);
        console.log("Vel x global : " + velocidadPelotaX);
        console.log("Vel y global : " + velocidadPelotaY);
        console.log("bloques en la Layer : " + this.numeroBloques);
        console.log("velocidad x en la layer : " + this.velocidadX);
        console.log("velocidad y en la layer : " + this.velocidadY);

        var spriteFondo = cc.Sprite.create(res.fondo_png);
        spriteFondo.setPosition(cc.p(size.width/2 , size.height/2));
        spriteFondo.setScale( size.width / spriteFondo.width );
        this.addChild(spriteFondo,-1);


        //añadimos la pelota
        this.spritePelota = cc.Sprite.create(res.bola_png);
        this.spritePelota.setPosition(cc.p(size.width/2 , size.height/2));
        this.addChild(this.spritePelota);

        //añadimos la barra
        this.spriteBarra = cc.Sprite.create(res.barra_2_png);
        this.spriteBarra.setPosition(cc.p(size.width/2 , size.height*0.1 ));
        this.addChild(this.spriteBarra);

        //añadimos bloques
        /*
        this.spriteBloque = cc.Sprite.create(res.cocodrilo_1_png);
        this.spriteBloque.setPosition(cc.p(this.spriteBloque.width/2 ,
                size.height - this.spriteBloque.height/2 ));

        this.addChild(this.spriteBloque);
        */

        this.inicializarBloques();


        //var actionMoverPelota = cc.MoveTo.create(1, cc.p(size.width, size.height));
        //var actionMoverPelota = cc.MoveBy.create(1, cc.p(100, 0));
        //this.spritePelota.runAction(actionMoverPelota);


        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown
        }, this)


        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                var actionMoverBarraX = null;
                var instancia = event.getCurrentTarget();
                if(instancia.keyPulsada == keyCode)
                     return;

                instancia.keyPulsada = keyCode;

                if( keyCode == 37){
                    console.log("Ir izquierda ");
                      actionMoverBarraX =
                        cc.MoveTo.create(Math.abs(instancia.spriteBarra.x - 0)/500,
                        cc.p(0,cc.winSize.height*0.1));
                }

                if( keyCode == 39){
                     console.log("Ir derecha ");
                      actionMoverBarraX =
                       cc.MoveTo.create(Math.abs(instancia.spriteBarra.x - cc.winSize.width)/500,
                       cc.p(cc.winSize.width,cc.winSize.height*0.1));
                }

                cc.director.getActionManager().
                    removeAllActionsFromTarget(instancia.spriteBarra, true);

                if( actionMoverBarraX != null)
                     instancia.spriteBarra.runAction(actionMoverBarraX);

            },
            onKeyReleased: function(keyCode, event){
                if(keyCode == 37 || keyCode == 39){
                      var instancia = event.getCurrentTarget();
                      instancia.keyPulsada = null;
                      cc.director.getActionManager().
                        removeAllActionsFromTarget(instancia.spriteBarra, true);
                }
            }
        }, this);



        this.scheduleUpdate();

        return true;
    },
    procesarMouseDown:function(event) {
           // alert("Pulsado ");//aparece en la consola (util para depurar)
            console.log(event.getLocationX());
            console.log(event.getLocationY());
            /*
            var actionMoverPelotaAPunto =
                cc.MoveTo.create(1,
                        cc.p(event.getLocationX(),
                        event.getLocationY()));
                        // Ambito procesarMouseDown
                        var instancia = event.getCurrentTarget();
                        instancia.spritePelota.runAction(actionMoverPelotaAPunto);
                        */

            var instancia = event.getCurrentTarget();

            cc.director.getActionManager().removeAllActionsFromTarget(instancia.spriteBarra, true);

            var actionMoverBarraX =
                cc.MoveTo.create(Math.abs(instancia.spriteBarra.x - event.getLocationX())/500,
                            cc.p(event.getLocationX(),
                             cc.winSize.height*0.1));


            instancia.spriteBarra.runAction(actionMoverBarraX);

    },update:function (dt) {
              var mitadAncho = this.spritePelota.getContentSize().width/2;
              var mitadAlto = this.spritePelota.getContentSize().height/2;

              // Nuevas posiciones
              this.spritePelota.x = this.spritePelota.x + this.velocidadX;
              this.spritePelota.y = this.spritePelota.y + this.velocidadY;


              //Colisiones
              var areaPelota = this.spritePelota.getBoundingBox();
              var areaBarra = this.spriteBarra.getBoundingBox();

              if( cc.rectIntersectsRect(areaPelota, areaBarra)){
                  console.log("Colision");

                  this.velocidadX = ( this.spritePelota.x - this.spriteBarra.x ) / 5;
                  this.velocidadY =  this.velocidadY*-1;

              }
                /*
              var areaBloque = this.spriteBloque.getBoundingBox();
              if( cc.rectIntersectsRect(areaPelota, areaBloque)){
                  console.log("Colision");
                  this.removeChild(this.spriteBloque);
              }

              */
              var destruido = false;
              for(var i = 0; i < this.arrayBloques.length; i++){
                   var areaBloque = this.arrayBloques[i].getBoundingBox();
                   if( cc.rectIntersectsRect(areaPelota, areaBloque)){
                      this.removeChild(this.arrayBloques[i]);//eliminamos de la capa
                      this.arrayBloques.splice(i, 1);//eliminamos del array
                      console.log("Quedan : "+this.arrayBloques.length);
                      destruido = true;
                      cc.audioEngine.playEffect(res.grunt_wav);
                   }
              }
              if(destruido){
                  this.velocidadX = this.velocidadX*-1;
                  this.velocidadY = this.velocidadY*-1;
              }

              if(this.arrayBloques.length <=0 ){
                 cc.director.pause();
                 cc.audioEngine.stopMusic();
                 this.getParent().addChild(new SiguienteNivel());

              }



              // Rebote
              if (this.spritePelota.x < 0 + mitadAncho){
                  this.spritePelota.x = 0 + mitadAncho;
                  this.velocidadX = this.velocidadX*-1;
              }
              if (this.spritePelota.x > cc.winSize.width - mitadAncho){
                  this.spritePelota.x = cc.winSize.width - mitadAncho;
                  this.velocidadX = this.velocidadX*-1;
              }
              if (this.spritePelota.y < 0 + mitadAlto){
                  // No rebota, se acaba el juego
                  cc.director.pause();
                  cc.audioEngine.stopMusic();
                  this.getParent().addChild(new GameOverLayer());
              }
              if (this.spritePelota.y > cc.winSize.height - mitadAlto){
                  this.spritePelota.y = cc.winSize.height - mitadAlto;
                  this.velocidadY = this.velocidadY*-1;
              }

    }, inicializarBloques:function() {

            //bloques aleatorios
            var insertados = 0;
            var fila = 0;
            var columna = 0;

            var framesBloqueCocodrilo = [];
            for (var i = 1; i <= 8; i++) {
                      var str = "cocodrilo" + i + ".png";
                      var frame = cc.spriteFrameCache.getSpriteFrame(str);
                      framesBloqueCocodrilo.push(frame);
            }
                  var animacionBloqueCocodrilo = new cc.Animation(framesBloqueCocodrilo, 0.1);

            var framesBloqueTigre = [];
            for (var i = 1; i <= 8; i++) {
                      var str = "tigre" + i + ".png";
                      var frame = cc.spriteFrameCache.getSpriteFrame(str);
                      framesBloqueTigre.push(frame);
            }
            var animacionBloqueTigre = new cc.Animation(framesBloqueTigre, 0.1);
            var framesBloquePanda = [];
                for (var i = 1; i <= 8; i++) {
                          var str = "panda" + i + ".png";
                          var frame = cc.spriteFrameCache.getSpriteFrame(str);
                          framesBloquePanda.push(frame);
                }
            var animacionBloquePanda = new cc.Animation(framesBloquePanda, 0.1);

            while (insertados < this.numeroBloques ){
                numero = Math.floor(Math.random()*3);
                //repetir constantemente la animacion
                var animacion = "";
                var accionAnimacionBloque = null;
                if(numero == 0){
                    animacion = "#cocodrilo1.png"
                   accionAnimacionBloque = new cc.RepeatForever(new cc.Animate(animacionBloqueCocodrilo));
                }
                else if(numero == 1){
                animacion = "#tigre1.png"
                accionAnimacionBloque = new cc.RepeatForever(new cc.Animate(animacionBloqueTigre));
                }else {
                animacion = "#panda1.png"
                accionAnimacionBloque = new cc.RepeatForever(new cc.Animate(animacionBloquePanda));
                }



               // var spriteBloqueActual = cc.Sprite.create(res.cocodrilo_1_png);
                var spriteBloqueActual = new cc.Sprite(animacion);


                spriteBloqueActual.runAction(accionAnimacionBloque);

                var x = ( spriteBloqueActual.width / 2 ) +
                              ( spriteBloqueActual.width * columna );
                var y = (cc.winSize.height - spriteBloqueActual.height/2 ) -
                              ( spriteBloqueActual.height * fila );

                spriteBloqueActual.setPosition(cc.p(x,y));

                this.arrayBloques.push(spriteBloqueActual);
                this.addChild(spriteBloqueActual);

                insertados++;
                columna++;

                if( x + spriteBloqueActual.width / 2 > cc.winSize.width){
                  columna = 0;
                  fila++;
                }
            }
       }



});//fin GameLayer

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        cc.director.resume();
        cc.audioEngine.playMusic(res.sonidobucle_wav, true);
        numBloquesGlobal = 0;
        velocidadPelotaX = 0;
        velocidadPelotaY = 0;

        console.log("Bloques globales : "+numBloquesGlobal);
        console.log("Vel x global : " + velocidadPelotaX);
        console.log("Vel y global : " + velocidadPelotaY);

        console.log("Ejecutada gameScene");

        var layer = new GameLayer();
        this.addChild(layer);
    }
});

var GameContinueScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        cc.director.resume();
        cc.audioEngine.playMusic(res.sonidobucle_wav, true);

        console.log("Bloques globales : "+numBloquesGlobal);
        console.log("Vel x global : " + velocidadPelotaX);
        console.log("Vel y global : " + velocidadPelotaY);

        console.log("Ejecutada continueScene");

        var layer = new GameLayer();
        this.addChild(layer);
    }
});
