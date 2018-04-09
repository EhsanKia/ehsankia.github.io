angular.module('Twitter', ['ngResource'])

function TwitterCtrl($scope, $resource){
    $scope.twitter = $resource('http://search.twitter.com/:action',
        {action:'search.json', q:'CSS3', rpp:'10', page:'1',
        callback:'JSON_CALLBACK'}, {get:{method:'JSONP'}} );

    $scope.page  = 1;
    $scope.twDiv = document.body.getElementsByTagName("div")[0];
    $scope.twTab = document.body.getElementsByTagName("table")[0];
    $scope.pBtn  = document.body.getElementsByTagName("button")[0];
    $scope.nBtn  = document.body.getElementsByTagName("button")[1];
    $scope.twResult = [];
    $scope.twResult.results = [];

    $scope.doSearch = function (){
        $scope.page = 1;
        $scope.twDiv.style.maxHeight = "28px";
        $scope.twTab.style.opacity = "0";

        setTimeout(function() {
            $scope.twResult = $scope.twitter.get( {q:$scope.searchTerm} );
        }, 400);

        setTimeout(function() {
            document.body.getElementsByTagName("div")[0].style.maxHeight = "800px";
        }, 750);

        setTimeout(function() {
            document.body.getElementsByTagName("table")[0].style.opacity = "1";
        }, 1100);
    };

    $scope.pbLimit = function () {
        if ($scope.page < 2)
            return "disabled";
    };

    $scope.nbLimit = function () {
        if ($scope.page > 9 || $scope.twResult.results.length < 10  )
            return "disabled";
    };

    $scope.changePage = function (d){
        if (d > 0) anim = "nextpage";
        else anim = "prevpage";
        $scope.page += d;
        $scope.twDiv.style.webkitAnimation = "";
        $scope.twTab.style.opacity = "0";

        setTimeout(function() {
            $scope.twDiv.style.webkitAnimation = anim + " 1s ease-in-out 0 1";
        }, 1);
        setTimeout(function() {
            $scope.twResult = $scope.twitter.get( {q:$scope.searchTerm, page:$scope.page} );
        }, 300);
        setTimeout(function() {
            $scope.twTab.style.opacity = "1";
        }, 700)

    };


    $scope.searchTerm = 'CSS3';
    $scope.doSearch();
}

