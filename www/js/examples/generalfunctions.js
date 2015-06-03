/**
 * Created by joaosilva on 01/06/15.
 */
app.service('GeneralFunctions', function($ionicPopup) {
    this.buildAlertPopUp = function (title, template) {
        var alertBadRequestPopup = $ionicPopup.alert({
            title: title,
            template: template
        });
    };
});