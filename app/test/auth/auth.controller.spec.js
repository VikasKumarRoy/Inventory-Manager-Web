(function () {
  'use strict';

  describe('Testing AuthController', function() {

      beforeEach(function () {
          module('appModule');
      });
    
      var $controller, $rootScope;
    
      beforeEach(inject(function(_$controller_, _$rootScope_){
        $controller = _$controller_;
        $rootScope = _$rootScope_;
      }));
    
      describe('Testing Credentials', function() {
        it('check email is valid', function() {
          var $scope = $rootScope.$new();
          var controller = $controller('AuthController', { $scope: $scope });
          expect($scope.credentials).toBeDefined();

          $scope.userDetails = {
            email: 'vikas.vr8@gmail.com',
            password: 'qwerty123456789',
            first_name: 'Vikas',
            last_name: 'Roy',
            date_of_birth: undefined,
            profile_picture: undefined,
            phone: undefined,
            address: undefined,
            gender: undefined
          }

          $scope.login();

          expect($scope.userDetails.email).toBe('vikas.vr8@gmail.com');
          expect($scope.userDetails.password).toBe('qwerty123456789');
          expect($scope.userDetails.first_name).toBe('Vikas');
          expect($scope.userDetails.last_name).toBe('Roy');
        });
      });
    });

})();
