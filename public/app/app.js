(function() {
    'use strict';

    angular.module('neon', [
            'ngMaterial',
            'ngRoute',
            'ngStorage',
            'pascalprecht.translate',
            'ngSanitize',
            'btford.markdown',
            'btford.socket-io',
            'cfp.hotkeys',
            'switchTheme',
            'toggleFullscreen',
            'start'
        ])
        .config(init)
        .run(start);

    function init($routeProvider, $locationProvider, $translateProvider, $mdThemingProvider, $localStorageProvider) {

        $locationProvider.html5Mode(true);

        $routeProvider.otherwise({
            redirectTo: '/'
        });

        //i18n: use it with {{'ModulName.Elementname' | translate}}
        $translateProvider.useStaticFilesLoader({
            prefix: 'locales/',
            suffix: '.json'
        });
        $translateProvider.useSanitizeValueStrategy('sanitize');
        $translateProvider.preferredLanguage('de-DE');
        $translateProvider.fallbackLanguage('de-DE');

        $mdThemingProvider.theme('default')
            .primaryPalette('lime')
            .accentPalette('deep-orange')
            .backgroundPalette('grey');

        $mdThemingProvider.theme('default-dark')
            .primaryPalette('lime')
            .accentPalette('deep-orange')
            .backgroundPalette('grey').dark();

        $mdThemingProvider.alwaysWatchTheme(true);

        $localStorageProvider.setKeyPrefix('neon');
    }

    function start($rootScope, $localStorage) {
        if ($localStorage.theme.replace(/"/g, '') === 'default-dark') {
            $rootScope.currentTheme = 'default-dark';
        } else {
            $rootScope.currentTheme = 'default';
        }
    }
})();
