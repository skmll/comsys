app.factory('ComsysInfo', function ($ionicLoading, $ionicPopup, ComsysStubService) {

	var isLogged = 0;

	return {

		getIsLogged: function() {
			return isLogged;
		},

		loginComsys: function (username, password, scope) {
			ComsysStubService.loginComsys(username, password)
			.success(function (data) {
				// Check response
				console.log(data);
				// closes loading spin
				scope.closeLoginModal();
				if(data.response==0){
					// Show errors
					this.buildAlertPopUp('Unable to login',
					'Errors: ' + data.errors);
				}else {
					// Change state
					isLogged = data.response;
				}
			})
			.error(function (error) {
				// Show errors
				this.buildAlertPopUp('Unable to login',
						'Unable to login: ' + error.message);
			});
		},

		buildAlertPopUp: function (title, template) {
			var alertBadRequestPopup = $ionicPopup.alert({
				title: title,
				template: template
			});
		}

	};

});
