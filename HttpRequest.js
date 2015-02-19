/**
* @package Code Craft
* @pdesc Conjunto de soluções front-end.
*
* @module HttpRequest
* @file HttpRequest.
*
* @author Rianna Cantarelli <rianna.aeon@gmail.com>
*/
'use strict';




// --------------------
// Caso não exista, inicia objeto CodeCraft
var CodeCraft = (CodeCraft || function () { });
if(typeof(CodeCraft) === 'function') { CodeCraft = new CodeCraft(); };











/**
* Gera uma instância "HttpRequest".
*
* @constructs
*
* @memberof CodeCraft
*
* @param {HttpConfig}                       [c]                                 Objeto contendo as configurações para as requisições.
*/
CodeCraft.HttpRequest = function (c) {





    /** 
    * Cria instâncias com capacidade de efetuarem requisições HTTP.
    *
    * @class HttpRequest
    *
    * @memberof CodeCraft
    *
    * @type {Class}
    *
    * @property {Function}                      Load                            Efetua uma requisição para o endereço informado.
    */





    /**
    * Configurações para requisições assíncronas.
    *
    * @typedef HttpConfig
    *
    * @memberof CodeCraft
    *
    * @property {String}                        method                              Método de requisição [post|get|...].
    * @property {Boolean}                       async                               Use "true" para requisições assíncronas.
    * @property {String}                        dataType                            Tipo de objeto esperado como resposta [json|text|xml].
    * @property {String}                        contentType                         Tipo de dados que serão enviados para o servidor.
    * @property {Function}                      onSucess                            Evento disparado quando uma requisição é bem sucedida.
    * @property {Function}                      onComplete                          Evento que ocorre SEMPRE ao final da requisição.
    * @property {Function}                      onTimeout                           Evento que ocorre quando a operação exceder o tempo de resposta.
    * @property {Function}                      onFail                              Evento disparado quando ocorrer algum erro na requisição.
    * @property {Integer}                       timeout                             Tempo de espera até encerrar a requisição por timeout.
    */










    /*
    * PROPRIEDADES PRIVADAS
    */





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
    * Configurações padrão para requisições assíncronas
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
            console.log('Request fail.\nCode : ' + statusCode + '\nError : ' + statusText);
        },
        timeout: 15000
    };

    // Efetua mescla dos dados informados pelo desenvolvedor com os padrões
    if (c !== undefined) { for (var it in c) { cfg[it] = c[it]; } }










    /*
    * MÉTODOS PRIVADAS
    */





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

            // Se o status apresenta código de sucesso na requisição...
            if (status == 0 || (status >= 200 && status < 300) || (status == 304 || status == 1223)) {
                var obj = http.responseText;
                switch (cfg.dataType) {
                    case 'json':
                        try { obj = eval('(' + obj + ')'); }
                        catch (e) {
                            console.log('Expected object fail to parse:');
                            console.log(obj);
                            obj = null;
                        }
                        break;
                    case 'xml':
                        try {
                            var parser = new DOMParser();
                            obj = parser.parseFromString(obj, "text/xml");
                        }
                        catch(e) {
                            console.log(http.responseText);
                        }
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
    * Converte um objeto JSON para uma string no formato QueryString [prop1=val1&prop2=val2]
    *
    * @param {JSON}     json                Objeto JSON que será convertido.
    *
    * @return {String}
    */
    var jsonToQueryString = function (json) {
        var strReturn = "";

        for (var it in json) {
            if (strReturn != "") { strReturn += "&"; }
            strReturn += it + "=" + encodeURIComponent(json[it]);
        }

        return strReturn;
    };





    /**
    * Converte um objeto JSON para uma string no formato QueryString [prop1=val1&prop2=val2]
    *
    * @param {JSON}     headers             Um objeto JSON contendo pares { key : value } onde
    *                                       "key" é o nome de um header a ser enviado junto na requisição e 
    *                                       "value" é o respectivo valor do header.
    *
    * @return {String}
    */
    var setHeadersOnRequest = function (headers) {
        if (headers !== undefined && headers !== null) {
            for (var it in headers) {
                http.setRequestHeader(it.toString(), headers[it]);
            }
        }
    };




















    /**
    * OBJETO PÚBLICO QUE SERÁ EXPOSTO.
    */
    var _public = this.Control = {
        /**
        * Efetua uma requisição para o URL informado.
        * 
        * @function Load
        *
        * @memberof HttpRequest
        *
        * @param {String}               url         Endereço URL da requisição.
        *                                           Um método pode ser especificado no inicio da url usando o formato:
        *                                           METHOD url      ex :    DELETE /application/User/99
        * @param {String|JSON}          [data]      Objeto JSON ou
        *                                           String com dados que serão enviados para o servidor.
        *                                           Utilize o formato querystring; prop1=val1&prop2=val2
        *                                           Use encodeURIComponent() para corrigir valores permitindo que os caracteres especiais
        *                                           não causem falha ao serem enviados.
        * @param {JSON}                 [headers]   Um objeto JSON contendo pares { key : value } onde
        *                                           "key" é o nome de um header a ser enviado junto na requisição e 
        *                                           "value" é o respectivo valor do header.
        */
        Load: function (url, data, headers) {
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


            // Verifica o formato do parametro "data".
            // se não for uma string, converte o objeto em uma querystring
            data = (data === null) ? null : ((typeof (data) === 'string') ? data : jsonToQueryString(data));


            switch (method) {
                case 'HEAD':
                case 'GET':
                    if (data != undefined && data !== null && data !== '') {
                        url = url + '?' + data;
                    }
                    http.open(method, url, cfg.async);
                    http.onreadystatechange = OnStateChange;


                    setHeadersOnRequest(headers);
                    http.send(null);

                    break;

                case 'PUT':
                case 'POST':
                case 'PATCH':
                case 'DELETE':
                case 'OPTIONS':
                case 'TRACE':
                case 'CONNECT':
                    http.open(method, url, cfg.async);
                    http.onreadystatechange = OnStateChange;

                    if (data !== undefined && data !== null && cfg.contentType !== false) {
                        http.setRequestHeader("Content-type", cfg.contentType);
                    }
                    else { data = null; }

                    setHeadersOnRequest(headers);
                    http.send(data);
                    break;
            }

            if (cfg.async) {
                evtTimeout = setTimeout(AbortOnTimeout, cfg.timeout);
            }
        },
        /**
        * Efetua o envio dos arquivos definidos para o URL alvo.
        * 
        * @function Upload
        *
        * @memberof HttpRequest
        *
        * @param {String}               url         Endereço URL para o upload.
        *                                           Os métodos que comumente devem ser usados para o upload de arquivos 
        *                                           são POST e PUT
        * @param {FormData}             data        Objeto "FormData" contendo todo o conteúdo de arquivos e demais
        *                                           informações que devem ser enviadas para a URL alvo.
        * @param {JSON}                 [headers]   Um objeto JSON contendo pares { key : value } onde
        *                                           "key" é o nome de um header a ser enviado junto na requisição e 
        *                                           "value" é o respectivo valor do header.
        */
        Upload: function (url, data, headers) {

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



            http.open(method, url, cfg.async);
            http.onreadystatechange = OnStateChange;

            setHeadersOnRequest(headers);
            http.send(data);

            evtTimeout = setTimeout(AbortOnTimeout, cfg.timeout);
        }
    };






    return _public;
};