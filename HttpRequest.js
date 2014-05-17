/**
* @package Code Craft
* @pdesc Conjunto de soluções front-end.
*
* @module HttpRequest
* @file Classe HttpRequest.
*
* @author Rianna Cantarelli <rianna.aeon@gmail.com>
*/















/** 
* Cria instâncias com capacidade de efetuarem requisições HTTP
*
* @class HttpRequest
*
* @global
*
* @type {Class}
*
* @property {Function}                      Load                                Efetua uma requisição para o endereço informado.
*/









/**
* Configurações para requisições assíncronas.
*
* @typedef HttpConfig
*
* @global
*
* @property {String}                        method                              Método de requisição [post|get].
* @property {Boolean}                       async                               Use "true" para requisições assíncronas.
* @property {String}                        dataType                            Tipo de objeto esperado como resposta [json|text|xml].
* @property {String}                        contentType                         Tipo de dados que serão enviados para o servidor.
* @property {Function}                      onSucess                            Evento disparado quando uma requisição é bem sucedida.
* @property {Function}                      onComplete                          Evento que ocorre SEMPRE ao final da requisição.
* @property {Function}                      onTimeout                           Evento que ocorre quando a operação exceder o tempo de resposta.
* @property {Function}                      onFail                              Evento disparado quando ocorrer algum erro na requisição.
* @property {Integer}                       timeout                             Tempo de espera até encerrar a requisição por timeout.
*/









/**
* Gera uma instância "HttpRequest".
*
* @constructs
*
* @memberof HttpRequest
*
* @param {HttpConfig}                       [c]                                 Objeto contendo as configurações para as requisições.
*/
var HttpRequest = function (c) {




    /**
    * Objeto XMLHttpRequest.
    *
    * @type {XMLHttpRequest}
    *
    * @memberof HttpRequest
    *
    * @private
    */
    var http = new XMLHttpRequest();

    /**
    * Evento que ocorre ao timeout.
    *
    * @type {Function}
    *
    * @memberof HttpRequest
    *
    * @private
    */
    var evtTimeout = null;


    /**
    * Configurações básicas para requisições assíncronas
    *
    * @type {HttpConfig}
    *
    * @memberof HttpRequest
    *
    * @private
    */
    var cfg = {
        method: 'POST',
        async: true,
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        onSucess: function (result) { },
        onComplete: function () { },
        onTimeout: function () { },
        onFail: function (statusCode, statusText) {
            alert('Erro na requisição.\nCode : ' + statusCode + '\nError : ' + statusText);
        },
        timeout: 15000
    };

    // Efetua mescla dos dados informados pelo desenvolvedor com os padrões
    if (c !== undefined) { for (var it in c) { cfg[it] = c[it]; } }





    /**
    * Evento de monitoramento de estado da requisição.
    * 
    * @function OnStateChange
    *
    * @memberof HttpRequest
    *
    * @private
    */
    var OnStateChange = function () {
        var state = http.readyState;

        if (state == 0 || state == 4) {
            clearTimeout(evtTimeout);
            var status = http.status;

            if (status == 0 || (status >= 200 && status < 300) || (status == 304 || status == 1223)) {
                var obj = http.responseText;
                switch (cfg.dataType) {
                    case 'json':
                        try { obj = eval('(' + obj + ')'); }
                        catch (e) { obj = null; }
                        break;
                    case 'xml':
                        var parser = new DOMParser();
                        obj = parser.parseFromString(obj, "text/xml");
                        break;
                }
                cfg.onSucess(obj);
            }
            else {
                cfg.onFail(http.status, http.statusText, http.response);
            }
            cfg.onComplete();
        }
    };

    /**
    * Aborta a requisição e chama o evento onTimeout.
    * 
    * @function AbortOnTimeout
    *
    * @memberof HttpRequest
    *
    * @private
    */
    var AbortOnTimeout = function () {
        http.abort();
        cfg.onTimeout();
        clearTimeout(evtTimeout);
    };





    /**
    * Efetua uma requisição para o endereço informado.
    * 
    * @function Load
    *
    * @memberof HttpRequest
    *
    * @param {String}           url         Endereço URI da requisição.
    *                                       Um método pode ser especificado no inicio da url usando o formato:
    *                                       METHOD url      ex :    DELETE /application/User/99
    * @param {String}           [params]    Parametros no formato QueryString : param1=value1&param2=value2
    */
    this.Load = function (url, params) {
        
        // Verifica o método que será utilizado
        var method = cfg.method.toUpperCase();
        if (url.indexOf(' ') != -1) {
            var spl = url.split(' ');

            method = spl[0].toUpperCase();
            url = spl[1];
        }


        // Caso seja uma url relativa, completa o endereço com o protocolo e dominio
        if (url.indexOf('://') == -1) {
            var port = (window.location.port) ? ':' + window.location.port : '';
            url = (url.indexOf('/') == 0) ? url.substring(1) : url;
            url = window.location.protocol + '//' + window.location.hostname + port + '/' + url;
        }

        switch (method) {
            case 'GET':
                if (params !== undefined) { url += '?' + params; }

                http.open(method, url, cfg.async);
                http.onreadystatechange = OnStateChange;
                http.send(null);

                break;

            case 'PUT':
            case 'POST':
            case 'PATCH':
            case 'DELETE':
                http.open(method, url, cfg.async);
                http.onreadystatechange = OnStateChange;

                if (params !== undefined && params !== null) {
                    http.setRequestHeader("Content-type", cfg.contentType);
                }
                else { params = null; }
                
                http.send(params);
                break;
        }

        evtTimeout = setTimeout(AbortOnTimeout, cfg.timeout);
    };

};