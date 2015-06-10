app.controller('ProfileCtrl', function ($scope, $state, $ionicHistory, $ionicModal, $timeout, $ionicPopup,
    $ionicLoading, ComsysStubService, ComsysInfo, $location) {

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

    // Form data for the change password modal
    $scope.changePasswordData = {
        oldPassword: "",
        newPassword: "",
        newRepeatPassword: ""
    };

    // Create the edit profile modal that we will use later
    $ionicModal.fromTemplateUrl('templates/comsys/editProfile.html', {
        scope: $scope
    }).then(function (modalEditProfile) {
        $scope.modalEditProfile = modalEditProfile;
    });

    // Triggered in the edit profile modal to close it
    $scope.closeEditProfileModal = function () {
        $scope.modalEditProfile.hide();
    };

    // Open the edit profile modal
    $scope.openEditProfileModal = function () {
        $scope.modalEditProfile.show();
    };

    // Create the change password modal that we will use later
    $ionicModal.fromTemplateUrl('templates/comsys/changePassword.html', {
        scope: $scope
    }).then(function (modalChangePassword) {
        $scope.modalChangePassword = modalChangePassword;
    });

    // Open the change password modal
    $scope.openChangePasswordModal = function () {
        $scope.modalChangePassword.show();
    };

    // Triggered in the change password modal to close it
    $scope.closeChangePasswordModal = function () {
        $scope.modalChangePassword.hide();
    };

    // Perform the edit profile action when the user submits the joinSquad form
    $scope.doChangePassword = function () {
        var loadingChangePassword = $ionicLoading.show({
            content: 'Saving new password information',
            showBackdrop: false
        });

        ComsysInfo.changeUserPassword($scope.changePasswordData.newPassword,
            $scope.changePasswordData.newRepeatPassword, $scope.changePasswordData.oldPassword);
    };

    // Change the variables to not logged state
    $scope.logout = function () {
        var loadingLogout = $ionicLoading.show({
      content: 'Saving logout information',
            showBackdrop: false
        });
        ComsysInfo.userLogout();
        $ionicLoading.hide();
        $location.path('/app/map');
    };
    
    
    
    /***** The functions below this line are revised and confirmed to be necessary *****/
     
    // Save profile changes
    $scope.doEditProfile = function (newNickname, newMapGrid, newCoordInpFormat) {
        
        $scope.profileData.nickname = newNickname;
        $scope.profileData.mapGrid = newMapGrid;
        $scope.profileData.coordInpFormat = newCoordInpFormat;
        $scope.profileData.coordInpFormatText = ComsysInfo.getCoordInpFormatTextFromID(parseInt($scope.profileData.coordInpFormat));
        $scope.updateComsysPersonalConfig();
    };

    // Send profile changes to server
    $scope.updateComsysPersonalConfig = function () {
        var displayGrid = -1;
        if ($scope.profileData.mapGrid) displayGrid = 1;
        else displayGrid = 0;
        
        ComsysStubService.updateComsysPersonalConfig($scope.profileData.nickname, displayGrid, $scope.profileData.coordInpFormat)
            .success(function (data) {
            console.log(data);
            $scope.closeEditProfileModal();
        })
            .error(function (error) {
            console.log(error);
        });
    }
});
