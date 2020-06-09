let app = angular.module("myApp", ["ngRoute","angular-websql"]);

function getDate(){
    let today = new Date();
    const data = addZero(today.getDate()) + '/' 
    + addZero((today.getMonth()+1)) +'/'+ 
    today.getFullYear() + ' ás '+ addZero(today.getHours()) + ':'+addZero(today.getMinutes());

    return data;
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

app.config(function($routeProvider) {

    $routeProvider
    .when('/home',{
        templateUrl: "templates/home.html",
        controller:"controllerHome"
    })
    .when('/cadastrar/',{
        templateUrl: "templates/cadastrar.html",
        controller:"controllerCadastrar"
    })
    .when('/editar/:id',{
        templateUrl: "templates/cadastrar.html",
        controller:"controllerEditar"
    })
    .otherwise({
        redirectTo:'/home'
    });

});

app.controller('navMenu', function($scope,$location){
    $scope.getClass = function (path) {
        return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    }
});

app.controller('controllerHome', function($scope, $webSql, $location){

    $scope.db = $webSql.openDatabase('tarefaBd', '1.0', 'Base de dados tarefas', 2 * 1024 * 1024);
    $scope.db.createTable("tabelaTarefas", {
            "id":{
                "type": "INTEGER",
                "null": "NOT NULL", // default is "NULL" (if not defined)
                "primary": true, // primary
                "auto_increment": true // auto increment
            },
            "tarefa":{
                "type": "TEXT",
                "null": "NOT NULL"
            },
            "descricao":{
                "type": "TEXT",
                "null": "NOT NULL"
            },
            "data":{
                "type": "TEXT",
                "null": "NOT NULL"
            },
            "dataModificado":{
                "type": "TEXT",
                "null": "NOT NULL"
            }
    });
    function loadTarefas(){
        $scope.db.selectAll("tabelaTarefas").then(function(results) {
            $scope.tarefas = [];
            for(var i=0; i < results.rows.length; i++){
              $scope.tarefas.push(results.rows.item(i));
            }
        });
    }
    loadTarefas();
    $scope.delete = function(id){
        M.toast({html: id.array.tarefa+' excluído com sucesso!', displayLength: 2000});
        $scope.db.del("tabelaTarefas", {"id": id.array.id});
        loadTarefas();
    }
    $scope.editar = function(id){
        $location.path("/editar/id="+id.array.id);
    }
    $('.collapsible').collapsible();
});

app.controller('controllerCadastrar', function($scope, $webSql) { 

    $scope.titulo = 'Cadastrar';
    $scope.db = $webSql.openDatabase('tarefaBd', '1.0', 'Test DB', 2 * 1024 * 1024);
    $scope.salvar = function(){
        $scope.db.insert('tabelaTarefas', {
            "tarefa": $scope.inputTarefa, 
            "descricao": $scope.textareaDescricao, 
            "data": $scope.inputData,
            "dataModificado":getDate()
            }).then(function(results) {
            M.toast({html: $scope.inputTarefa+' adicionado com sucesso!', displayLength: 2000});
            $('form')[0].reset();
        })
     }
});

app.controller('controllerEditar', function($scope, $webSql, $routeParams, $location){
    const id = $routeParams.id.replace('id=','');
    $scope.titulo = 'Editar';

    $scope.db = $webSql.openDatabase('tarefaBd', '1.0', 'Test DB', 2 * 1024 * 1024);

    $scope.db.select("tabelaTarefas", {
        "id": id
    }).then(function(results) {
        for(i=0; i < results.rows.length; i++){
          $scope.inputTarefa = results.rows[i].tarefa;
          $scope.inputData = results.rows[i].data;
          $scope.textareaDescricao = results.rows[i].descricao;
          $('label').addClass('active');
        }
    })

    
    $('#descricao').focus(function(){
        $(this).height(0).height(this.scrollHeight);
    });

    $scope.salvar = function(){
        $scope.db.update("tabelaTarefas", {
            "tarefa": $scope.inputTarefa, 
            "descricao": $scope.textareaDescricao, 
            "data": $scope.inputData,
            "dataModificado":getDate()}, {
            'id': id
        });
        M.toast({html: 'item alterado com sucesso!', displayLength: 2000});
        $location.path("/home");
    }
});

