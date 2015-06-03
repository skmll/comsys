/**
 * Created by joaosilva on 25/05/15.
 */
app.controller('ProfileCtrl', function ($scope, $state, $ionicHistory, $ionicModal, $timeout, $ionicPopup,
                                        $ionicLoading, AppService, OperatorStubService, OperatorInfo) {

    // Set userLogged - 0:Not logged 1:Logged
    $scope.isLogged = AppService.getIsLogged();

    // Form data for the edit profile modal
    $scope.profileData = {
        nickname: OperatorInfo.getNickname(),
        country: OperatorInfo.getCountry(),
        rank: OperatorInfo.getRank(),
        coordInpFormat: OperatorInfo.getCoordInpFormat(),
        coordInpFormatText: OperatorInfo.getCoordInpFormatText(),
        mapGrid: OperatorInfo.getMapGrid(),
        specialisation: OperatorInfo.getSpecialisation()
    };

    // Form data for the edit profile modal
    $scope.editProfileData = $scope.profileData;

    // Form data for the change password modal
    $scope.changePasswordData = {
        oldPassword: "",
        newPassword: "",
        newRepeatPassword: ""
    };

    // Create the edit profile modal that we will use later
    $ionicModal.fromTemplateUrl('templates/operator/editProfile.html', {
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

    // Perform the edit profile action when the user submits the joinSquad form
    $scope.doEditProfile = function () {
        var loadingEditProfile = $ionicLoading.show({
            content: 'Saving new profile information',
            showBackdrop: false
        });

        OperatorInfo.editProfileData($scope.editProfileData.mapGrid, $scope.editProfileData.coordInpFormat,
            $scope.editProfileData.nickname, $scope.editProfileData.country, $scope.editProfileData.rank,
            $scope.editProfileData.specialisation);
    };

    // Create the change password modal that we will use later
    $ionicModal.fromTemplateUrl('templates/operator/changePassword.html', {
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

        OperatorInfo.changeUserPassword($scope.changePasswordData.newPassword,
            $scope.changePasswordData.newRepeatPassword, $scope.changePasswordData.oldPassword);
    };

    // Change the variables to not logged state
    $scope.logout = function () {
        var loadingLogout = $ionicLoading.show({
            content: 'Saving logout information',
            showBackdrop: false
        });

        OperatorInfo.userLogout();
    };
});
