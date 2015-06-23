app.controller('ProfileCtrl', function ($scope, $state, $ionicHistory, $ionicModal, $timeout, $ionicPopup,
    $ionicLoading, ComsysStubService, ComsysInfo, $location, $ionicNavBarDelegate) {
    
    // Set logged user ID
    $scope.userID = ComsysInfo.getUserID();

    // Get data to fill profile
    $scope.profileData = {
        nickname: ComsysInfo.getNickname(),
        coordInpFormat: ComsysInfo.getCoordInpFormat(),
        coordInpFormatText: ComsysInfo.getCoordInpFormatText(),
        mapGrid: ComsysInfo.getMapGrid()
    };

    $scope.editProfileData = {
        nickname: ComsysInfo.getNickname(),
        coordInpFormat: ComsysInfo.getCoordInpFormat(),
        mapGrid: ComsysInfo.getMapGrid()
    };
    
    /*** Logout ***/
    $scope.logout = function () {
        
        $ionicLoading.show({
            content: 'Logging out...',
            showBackdrop: false
        });
        
        // Try to logout and store the result
        ComsysStubService.logoutComsys()
        
		.success(function (data) {
            
            $ionicLoading.hide();
			console.log(data); // DEBUG
            
			if ( data.response == 0 ) {
				ComsysInfo.buildAlertPopUp('Logout error', 'Unable to logout!');
				
			} else {
                // Reset app info -> Set logged in user to 0, clear cache and navigation history and send user to map
                ComsysInfo.userLogout();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $location.path('/app/map');
				ComsysInfo.buildAlertPopUp('Logout', 'Logout successful!');
			}
		})
        
		.error(function (error) {
			$ionicLoading.hide();
            ComsysInfo.buildAlertPopUp('Server error', 'Unable to log out. Either the server or your internet connection is down.');
		});
        
    };
    
    /*** Edit profile ***/
  
    // Create the edit profile modal
    $ionicModal.fromTemplateUrl('templates/comsys/editProfile.html', {
        scope: $scope
    }).then(function (modalEditProfile) {
        $scope.modalEditProfile = modalEditProfile;
    });
    
    // Open the edit profile modal
    $scope.openEditProfileModal = function () {
        $scope.modalEditProfile.show();
    };

    // Close the edit profile modal
    $scope.closeEditProfileModal = function () {
        $scope.modalEditProfile.hide();
    };

    // Send profile changes to server
    $scope.doEditProfile = function (newNickname, mapGridChecked, newCoordInpFormat) {
        
        $ionicLoading.show({
            content: 'Editing profile...',
            showBackdrop: false
        });
        
        var displayMapGrid = 0;
                    
        if(mapGridChecked) {
            displayMapGrid = 1;
        }
        
        ComsysStubService.updateComsysPersonalConfig(newNickname, displayMapGrid, newCoordInpFormat)
        
            .success(function (data) {
                
                $ionicLoading.hide();
                console.log(data); // DEBUG
                
                if (data.response != 0) {
                    
                    // Update scope data
                    $scope.profileData.nickname = newNickname;
                    $scope.profileData.mapGrid = displayMapGrid;
                    $scope.profileData.coordInpFormat = newCoordInpFormat;
                    $scope.profileData.coordInpFormatText = ComsysInfo.getCoordInpFormatTextFromID(parseInt($scope.profileData.coordInpFormat));
                    
                    // Update service data
                    ComsysInfo.setNickname(newNickname);
    				ComsysInfo.setCoordInpFormat(newCoordInpFormat);
    				ComsysInfo.setMapGrid(displayMapGrid);
                    ComsysInfo.setCoordInpFormatText(ComsysInfo.getCoordInpFormatTextFromID(parseInt(newCoordInpFormat)));
                    
                    // Display message and close modal
                    ComsysInfo.buildAlertPopUp('Edit profile', 'Your profile was successfull edited!');
                    $scope.closeEditProfileModal();
                 } 
                 
                 else {
                     var errorMessage = ComsysInfo.getAllErrors(data.errors);
                     ComsysInfo.buildAlertPopUp('Edit profile error', errorMessage);
                 }
        })
        
        .error(function (error) {
            $ionicLoading.hide();
            ComsysInfo.buildAlertPopUp('Server error', 'Unable to edit profile. Either the server or your internet connection is down.');
        });
        
    };
    
    /*** Change Password ***/
     
    // Initialize change pasword data
    $scope.changePasswordData = {
        oldPassword: "",
        newPassword: "",
        newRepeatPassword: ""
    };
    
    // Create the change password modal
    $ionicModal.fromTemplateUrl('templates/comsys/changePassword.html', {
        scope: $scope
    }).then(function (modalChangePassword) {
        $scope.modalChangePassword = modalChangePassword;
    });

    // Open the change password modal
    $scope.openChangePasswordModal = function () {
        $scope.modalChangePassword.show();
    };

    // Close the change password modal
    $scope.closeChangePasswordModal = function () {
        $scope.modalChangePassword.hide();
    };

    // Perform change password
    $scope.doChangePassword = function () {
        
        $ionicLoading.show({
            content: 'Changing password...',
            showBackdrop: false
        });

        ComsysInfo.changeUserPassword($scope.changePasswordData.oldPassword, $scope.changePasswordData.newPassword,
            $scope.changePasswordData.newRepeatPassword, $scope.closeChangePasswordModal);
        
    };
    
});
