var bookmark = angular.module('bookmark',['firebase']);

bookmark.controller("Ctrl", function ($scope, $firebaseArray) {
	$scope.url;
	$scope.fbname;
	$scope.pagetitle;
	

	var firebaseURL = "https://jerkinbookmark.firebaseio.com/";

	$scope.getList = function() {
  		var echoRef = new Firebase(firebaseURL); 		
 		if($scope.$authData != null){
 			var query = echoRef.child($scope.$authData.uid).orderByChild("url");
 			$scope.urlArr = $firebaseArray(query);
 		} 		
 		else{
 			$scope.login=true;
 		}
    };


    


	$scope.add = function() { 
		if($scope.$authData != null){
	    		if($scope.checkform.url.$valid){
	    			var url = $scope.url.text;
	    			$.ajax({
					  	dataType:'json',
					 	url: "./getURLTitle.php?url=" + url,
					  	success: function(data) {
					     //do stuff here with the result
					     	console.log(data);
						    $scope.pagetitle=data.substring(7);
							$scope.urlArr.$add({
								url: $scope.url.text,
								title: $scope.pagetitle
							});
							$scope.url.text='';
							$scope.pagetitle='';
 						 }   
					});
	    		}
	    }

	};


    $scope.remove = function (url) {
      $scope.urlArr.$remove(url);
    };



	$scope.FBLogin = function () {
	      var ref = new Firebase(firebaseURL);
	      ref.authWithOAuthPopup("facebook", function(error, authData) {
	      if (error) {
	        console.log("Login Failed!", error);
	      } else {
	      	$scope.login=false;
	        $scope.$apply(function() {
	        $scope.$authData = authData;
	        $scope.$fbname=authData.facebook.displayName;

	        var query = ref.child(authData.uid).orderByChild("url");
	        $scope.urlArr = $firebaseArray(query);


	      });
	      console.log("Authenticated successfully with payload:", authData);


	      // do something with the login info
	    }
	  });
	};

	$scope.FBLogout = function () {
	  var ref = new Firebase(firebaseURL);
	  ref.unauth();
	  delete $scope.$authData;
	  $scope.urlArr=null;
	  $scope.login=true;
	  // do something after logout
	};

    $scope.getList();


});