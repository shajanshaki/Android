
var app = angular.module('myApp', ['BotDetectCaptcha','noCAPTCHA']);

angular.module('myApp')
  .config(['noCAPTCHAProvider', function (noCaptchaProvider) {
    noCaptchaProvider.setSiteKey('<your site key>');
    noCaptchaProvider.setTheme('dark');
  }
]);
 app.controller('BasicController', function($scope, $http, Captcha) {

  // captcha validation messages
  $scope.successMessages = '';
  $scope.errorMessages = '';
  
  // basic captcha url
  var basicUrl = '/bdc4-simple-api-angularjs-captcha-example/basic-captcha';
  
  $scope.validate = function(valid) {

    if (!valid) {
      return;
    }
    
    // after UI form validation passed, 
    // we will need to validate captcha at server-side once before we save form data in database, etc.
    
    // create new BotDetect Captcha instance
    var captcha = new Captcha();
    
    // captcha id for validating captcha at server-side
    var captchaId = captcha.captchaId;
    
    // captcha code input value for validating captcha at server-side
    var captchaCode = $scope.captchaCode;

    var postData = {
      captchaId: captchaId,
      captchaCode: captchaCode
    };
    
    $http({
      method: 'POST',
      url: basicUrl,
      data: JSON.stringify(postData)
    })
      .then(function(response) {
        if (response.data.success) {
          // captcha validation passed at server-side
          $scope.successMessages = 'CAPTCHA validation passed.';
          $scope.errorMessages = null;
        } else {
          // captcha validation falied at server-side
          $scope.errorMessages = 'CAPTCHA validation falied.';
          $scope.successMessages = null;
        }
        
        // always reload captcha image after validating captcha at server-side 
        // in order to update new captcha code for current captcha id
        captcha.reloadImage();
      }, function(error) {
        console.log(error.data);
      });
  };
   
});