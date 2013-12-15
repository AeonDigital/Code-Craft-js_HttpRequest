 Code Craft - HttpRequest
==========================

> [Aeon Digital](http://www.aeondigital.com.br)
>
> rianna@aeondigital.com.br


**Code Craft** é um conjunto de soluções front-end e outras server-side para a construção de aplicações web.
Tais soluções aqui apresentadas são a minha forma de compartilhar com a `comunidade online` parte do que aprendi 
(e continuo aprendendo) nos foruns, sites, blogs, livros e etc. assim como na experiência adquirida no contato
direto com profissionais e estudantes que, como eu, amam o universo `Web Developer` e nunca se dão por satisfeitos 
com seu nível atual de conhecimento.


## C.C. - HttpRequest

Classe para efetuar requisições Http.


### Configurações

Ao criar uma instância os seguintes atributos internos podem ser configurados.

* `method`                  : Método de requisição [post|get].
* `async`                   : Indica se as requisições são ou não assíncronas.
* `dataType`                : Tipo de objeto esperado como resposta [json|text|xml].
* `contentType`             : Tipo de dados que serão enviados para o servidor.
* `onSucess`                : Evento disparado quando uma requisição é bem sucedida.
* `onComplete`              : Evento que ocorre SEMPRE ao final da requisição.
* `onTimeout`               : Evento que ocorre quando a operação exceder o tempo de resposta.
* `onFail`                  : Evento disparado quando ocorrer algum erro na requisição.
* `timeout`                 : Tempo de espera até encerrar a requisição por timeout.


### Métodos públicos


* `Load`                    : Efetua uma requisição para o endereço informado.


**Importante**

Tenha em mente que em algumas vezes, neste e em outros projetos **Code Craft** optou-se de forma consciênte em 
não utilizar uma ou outra *regra de otimização* dos artefatos de software quando foi percebida uma maior vantagem para
a equipe de desenvolvimento em flexibilizar tal ponto do que extritamente seguir todas as regras de otimização.


### Compatibilidade

Não é intenção deste nem de outros projetos do conjunto de soluções **Code Craft** em manter 
compatibilidade com navegadores antigos (IE8<).


________________________________________________________________________________________________________________________



## Licença

Para este e outros projetos **Code Craft** é utilizada a [Licença GNUv3](LICENCE.md).
