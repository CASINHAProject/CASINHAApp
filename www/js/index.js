/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var com = new Object();
var lat;
var lon;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {     
        app.receivedEvent('deviceready');
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        if(JSON.parse(localStorage.getItem("dataUser")) != null){
            console.log("Entrou na falha");            
            com = JSON.parse(localStorage.getItem("dataUser"));
            initConnection();
            telaAtuadores();
        }else{
            carregaTelaLogin();
        }       
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    }
};

function carregaTelaLogin(){
    
    $(".workScreen").html(
        "<div class='card-panel white medium'>"+
        "<span class='black-text'>"+
        "<h4 class='center-align'>Login</h4>"+
        "<hr>"+
        "</span>"+
        "<div class='row'>"+
        "<div class='input-field col s12'>"+
          "<input id='user' type='text' class='validate'>"+
          "<label for='user'>Username</label>"+
        "</div>"+
        "<div class='input-field col s12'>"+
          "<input id='pass' type='password' class='validate'>"+
          "<label for='pass'>Senha</label>"+
        "</div>"+
        "<div class='input-field col s12'>"+
          "<input id='key' type='text' class='validate'>"+
          "<label for='key'>Chave de acesso</label>"+
        "</div>"+
        "<div class='container center-align'>"+
          "<a class='modal-action modal-close waves-effect waves-light btn green' onclick='submit(user.value, pass.value, key.value);' href='#!''>Entrar</a>"+
        "</div>"+
      "</div>"+
       "<div class='row'>"+
      "<div class='col s12 m6'>"+
          "<div class='card blue-grey darken-1'>"+
            "<div class='card-content white-text'>"+
              "<span class='card-title'>O que é o CASINHA</span>"+
              "<p><b>CASINHA</b> (<i><b>CA</b>sinha <b>S</b>ocial <b>I</b>ntegration <b>N</b>etwork for <b>H</b>ome <b>A</b>ssistant</i>) é uma ferramenta web onde você pode automatizar, controlar e monitorar qualquer ambiente através da <b>Internet das Coisas</b>.</p>"+
              "<p>É simples e fácil :)</p>"+
              "<p>Gerenciamento de qualquer lugar do mundo.</p>"+
          "</div>"+
      "</div>"+       
      "</div>"+
      "<div class='col s12 m6'>"+
          "<div class='card red darken-1'>"+
            "<div class='card-content white-text'>"+
              "<span class='card-title'>Equipe</span>"+
              "<ul>"+
                "<li><i class='material-icons left'>face</i><a class='lin' href='http://fb.com/difernandosl' target='_blank'>Diego Fernando</a></li>"+
                "<li><i class='material-icons left'>face</i><a class='lin' href='http://twitter.com/diego5672' target='_blank'>Bruno Lopes</a></li>"+
                "<li><i class='material-icons left'>face</i><a class='lin' href='mailto:diegofernando5672@gmail.com'>Leonardo Augusto</a></li>"+
              "</ul>"+
            "</div>"+
          "</div>"+
      "</div>"+
"</div>"
    );
    $("#barraux").addClass("barraux-hide");
}

function submit(username, password, key){

    $.ajax({
            url : "http://casinhaproject.herokuapp.com/api/", // the endpoint
            type : "POST", // http method
            async : false,
            data : { 
                user : username,
                pass : password,
                token : key,
             },

            success : function(json) {
                //com = JSON.parse(json);
                console.log(json);
                com = json;
                window.localStorage.setItem("dataUser", JSON.stringify(json));
                var $toastContent = $('<span>Finalizado</span>');
                Materialize.toast($toastContent, 2000);
                initConnection();
                telaAtuadores();
                
            },

            error : function(xhr,errmsg,err) {
                console.log(xhr.status + ": " + xhr.responseText);
                var $toastContent = $('<span>Algo está errado. Verifique se você tem acesso ao ambiente</span>');
                Materialize.toast($toastContent, 4000);
            },

            beforeSend: function(){
              var $toastContent = $('<span>Autenticando. Aguarde...</span>');
              Materialize.toast($toastContent, 1000);
            },
            complete: function(){
              
            },
        });
    return false;
    
}

function uploc(){
    console.log("Foi ao uploc");
    console.log("lat:"+lat);
    $.ajax({
            url : "http://casinhaproject.herokuapp.com/api/localization/", // the endpoint
            type : "POST", // http method
            async : false,
            data : { 
                key : com["hash_key"],
                latitude : lat,
                longitude : lon,
             },

            success : function(json) {
                //com = JSON.parse(json);
                console.log(json);
                var $toastContent = $('<span>Nova key: '+ json +'</span>');
                Materialize.toast($toastContent, 50000);
                
            },

            error : function(xhr,errmsg,err) {
                 var $toastContent = $('<span>Erro: '+ xhr.responseText +'</span>');
                Materialize.toast($toastContent, 700);
                console.log(xhr.status + ": " + xhr.responseText);
            },

            beforeSend: function(){
              var $toastContent = $('<span>Alterando... Aguarde...</span>');
              Materialize.toast($toastContent, 1000);
            },
            complete: function(){
              var $toastContent = $('<span>Finalizado</span>');

              Materialize.toast($toastContent, 1000);
            },
        });
    return false;
    
}


function telaAtuadores(){
    
    $(document).ready(function(){
        $('.modal').modal();
    });
    $(".workScreen").html("<div class='card-panel white medium'>"+
                            "<span class='black-text'>"+
                                "<h4 class='center-align'><b>" + com["name"] + "<b/></h4>"+
                                "<hr>"+
                            "</span>"+
                            "<ul class='collection lis'>"+ listAc()+
                            "</ul>"+
                            "<div class='container center-align'>"+
                                "<a class='modal-action modal-close waves-effect waves-light btn green' href='#state'>Ver detalhes</a>"+
                            "</div>"+
                         "</div>"+
                         "<div id='state' class='modal'>"+
                            "<div class='modal-content'>"+
                                "<h4 class='center-align'>"+com["name"]+"</h4>"+
                                "<img class='responsive-img materialboxed' src="+com["image"]+">"+
                                "<p>Criador: "+ com["creator"]["username"] +"</p>"+
                                "<p>Sensores/Atuadores: "+ com["actuators"].length +"</p>"+
                                "<p>Chave: "+ com["hash_key"] +"</p>"+
                                "<p>Broker: "+ com["server"] +"</p>"+
                                "<p>Você está a <span id='dis'></span> km's de distância de "+com["name"]+"</p>"+
                                "<div class='container center-align'>"+
                                    "<a class='modal-action modal-close waves-effect waves-light btn red' onclick='uploc();' href='#!''>Estou em casa!</a>"+
                                
                                "</div>"+
                            "</div>"+
                            
                                "<div class='container center-align'>"+
                                    "<a class='modal-action modal-close waves-effect waves-light btn black' href='#!''>Fechar</a>"+
                                "</div>"+
                                
                           
                        "</div>"
        );
    $("#barraux").removeClass("barraux-hide");
}


function listAc(){
    var l = "";
    for (var i = 0; i < com["actuators"].length; i++){
        l += "<li class='collection-item avatar'>"+
                "<div class='container'>"+
                "<div class='col s7'>";
        if(com["actuators"][i]["actuator_type"] == 1){
                l += "<i class='material-icons circle' id='icon"+com["actuators"][i]["id"]+"'>"+
                    "wb_incandescent"+
                    "</i>";
        }else if(com["actuators"][i]["actuator_type"] == 2){
            l += "<i class='material-icons circle' id='icon"+com["actuators"][i]["id"]+"'>"+
                "settings_input_antenna"+
                "</i>";
        }else if(com["actuators"][i]["actuator_type"] == 3){
            l +="<i class='material-icons circle' id='icon"+com["actuators"][i]["id"]+"'>"+
                "ac_unit"+
                "</i>";
        }else if(com["actuators"][i]["actuator_type"] == 4){
            l +="<i class='material-icons circle' id='icon"+com["actuators"][i]["id"]+"'>"+
                "toys"+
                "</i>";
        }else{
            l +="<i class='material-icons circle' id='icon"+com["actuators"][i]["id"]+"'>"+
                "devices_other"+
                "</i>";
        }

        l += "<span class='title truncate'><b>"+com["actuators"][i]["name"]+"</b></span>"+
                                  "<p><span class='truncate'>"+com["actuators"][i]["description"]+"</span>"+
                                  "<span class='truncate'><b>Tópico:</b> "+ com["actuators"][i]["topic"] +"</span>"+
                                  "</p>"+
                                  "</div>";
        l += "<div class='col s5'>";

        if (com["actuators"][i]["actuator_type"] == 1 || com["actuators"][i]["actuator_type"] == 4) {
                l += "<div class='switch'>";
                l += "<label>";
                l += "<input id='element"+com["actuators"][i]["id"]+"' onclick='alterCheck(\""+com["actuators"][i]["id"]+"\",\""+com["actuators"][i]["topic"]+"\");' type='checkbox'>";
                l += "<span class='lever'></span>";
                l += "</label>";
                l += "</div>"; 
        }else if(com["actuators"][i]["actuator_type"] == 2){
            l += "<p><b>Valor:</b><span id='element"+com["actuators"][i]["id"]+"'>...</span> <b>Km</b></p>";
        }else if(com["actuators"][i]["actuator_type"] == 3){
            l += "<p><b>Valor:</b><span id='element"+com["actuators"][i]["id"]+"'>...</span> <b>ºC</b></p>";
        }else{
            l += "<p><b>Valor:</b><span id='element"+com["actuators"][i]["id"]+"'>...</span> <b></b></p>";
        }

        l+= "</div>";
        l+= "</div>";
        l+= "</li>";
    }
    return l;
}

function alterCheck(numAc, topicAc) {
    console.log(topicAc);
    console.log(numAc);
    console.log($('#element'+numAc).prop('checked'));
    
    bool = $('#element'+numAc).prop('checked');
    
    if(bool == true){
        m = new Paho.MQTT.Message('on');
    }else{
        m = new Paho.MQTT.Message('off');
    }

    console.log(m);
    m.destinationName = topicAc;
    client.send(m);
    Materialize.toast('Mensagem publicada no ambiente. Aguarde a confirmação...', 540);
    $('#element'+numAc).prop('disabled', 'true');
    
}

function sair(){
    navigator.app.exitApp();
}

//coding by Diego Fernando

numbrand = Math.floor(Math.random() * 500) + 1;



// Create a client instance
 client = new Paho.MQTT.Client();
//Example client = new Paho.MQTT.Client("m11.cloudmqtt.com", 32903, "web_" + parseInt(Math.random() * 100, 10));



function initConnection(){
    Materialize.toast('Tentando conexão...', 2000);
    client = new Paho.MQTT.Client(com["server"], parseInt(com["portws"]), "kfm"+numbrand);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    var options = {
        useSSL: true,
        userName: com["user"],
        password: com["password"],
        onSuccess:onConnect,
        onFailure:doFail
    }

    // connect the client
    client.connect(options);
}

// set callback handlers


// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    Materialize.toast('Conexão estabelecida para o ambiente ', 2000);
    console.log("onConnect");
    $('#connectInfo').html("conectado");
    for (var i = com["actuators"].length - 1; i >= 0; i--) {
        client.subscribe("r/"+com["actuators"][i]["topic"]);
        client.subscribe("rs/"+com["actuators"][i]["topic"]);

    }

    client.subscribe("m");
    Materialize.toast('Carregando estado dos atuadores', 4000);
    for (var i = com["actuators"].length - 1; i >= 0; i--) {

        console.log(i);
        message = new Paho.MQTT.Message("state");
        message.destinationName = com["actuators"][i]["topic"];
        client.send(message);
    }
}

function doFail(e){
    Materialize.toast('Erro ao conectar: ' + e, 24000);
console.log(e);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
if (responseObject.errorCode !== 0) {
  console.log("onConnectionLost:"+responseObject.errorMessage);
}
}

// called when a message arrives
function onMessageArrived(message) {
    //$('.reloadtl').html("<a class='waves-effect waves-light btn green tooltipped' data-position='top' data-delay='50' data-tooltip='*Apenas mensagens originadas da plataforma CASINHA são salvas no banco' href=''><i class='material-icons right'>refresh</i>*Atualize a lista</a>");
    for (var i = com["actuators"].length - 1; i >= 0; i--) {
        console.log(message.destinationName + " == " + "r/"+com["actuators"][i]["topic"] + "?");
        if (message.destinationName == "r/"+com["actuators"][i]["topic"]) {
            //console.log("sim");
            $("#element"+com["actuators"][i]["id"]).prop('disabled', null);
            if (com["actuators"][i]["actuator_type"] == 1 || com["actuators"][i]["actuator_type"] == 4) {
                if (message.payloadString == "1") {
                    $("#element"+com["actuators"][i]["id"]).prop('checked', true);
                    $("#icon"+com["actuators"][i]["id"]).addClass('yellow');
                    Materialize.toast('Mensagem no ambiente ' + com["actuators"][i]["name"] + ' foi ligado(a) neste momento', 700);
                    //addAction(idHouse, 'ligou o atuador <b>'+ jdata[i].name);
                } else {
                    $("#element"+com["actuators"][i]["id"]).prop('checked', null);
                    $("#icon"+com["actuators"][i]["id"]).removeClass('yellow')
                    Materialize.toast('Mensagem no ambiente ' + com["actuators"][i]["name"] + ' foi desligado(a) neste momento', 700);
                    //addAction(idHouse, 'desligou o atuador <b>'+ jdata[i].name);
                }
                
            } else{
                $("#element"+com["actuators"][i]["id"]).html(message.payloadString);
            }
        }
    }
    if(message.destinationName == "r/luz1"){
        $("#luz1").html(message.payloadString);
    }else if(message.destinationName == "r/luz2"){
        $("#luz2").html(message.payloadString);
    }else{
        if(message.destinationName == "m"){
            Materialize.toast('Mensagem no ambiente:' +message.payloadString, 4004);
            navigator.notification.beep(1);
        }
        
    }

    for (var i = 0; i<com["actuators"].length; i++) {
        console.log(message.destinationName + " == " + "rs/"+com["actuators"][i]["topic"] + "?");
        if (message.destinationName == "rs/"+com["actuators"][i]["topic"]) {
            //console.log("sim");
            $("#element"+com["actuators"][i]["id"]).prop('disabled', null);
            if (com["actuators"][i]["actuator_type"] == 1 || com["actuators"][i]["actuator_type"] == 4) {
                if (message.payloadString == "1") {
                    $("#element"+com["actuators"][i]["id"]).prop('checked', true);
                    $("#icon"+com["actuators"][i]["id"]).addClass('yellow');
                } else {
                    $("#element"+com["actuators"][i]["id"]).prop('checked', null);
                    $("#icon"+com["actuators"][i]["id"]).removeClass('yellow')
                }
                
            } else{
                $("#element"+com["actuators"][i]["id"]).html(message.payloadString);
            }
        }
    }
    //console.log("onMessageArrived:"+message.payloadString);
console.log("onMessageArrived:"+message.destinationName);
}

function addTopic(topic, message) {
    console.log("topic");
    m = new Paho.MQTT.Message(message);
    m.destinationName = topic;
    client.send(m);
    Materialize.toast('Tópico publicado no ambiente', 540);
}

function addMessage(){
    console.log("Evento para adicionar mensagem: " +$("#message").val());
    m = new Paho.MQTT.Message($("#message").val());
    m.destinationName = 'm';
    client.send(m);
    Materialize.toast('Mensagem publicada no ambiente', 340);
    //$('.loadadd').removeClass("semfunc");
    
}

function logout(){
    localStorage.clear();
    parent.window.document.location.href = '';
}

function onSuccess(position) { 
    console.log(distLatLong(position.coords.latitude, position.coords.longitude, com["latitude"], com["longitude"]));
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    if(com["latitude"]){
        $("#dis").html(distLatLong(position.coords.latitude, position.coords.longitude, parseFloat(com["latitude"]), parseFloat(com["longitude"])));        
    }
}

function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}


function distLatLong(lat1,lon1,lat2,lon2) {
  var R = 6371;
  var dLat = (lat2-lat1) * (Math.PI/180);
  var dLon = (lon2-lon1) * (Math.PI/180);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}