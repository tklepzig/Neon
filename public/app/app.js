(function() {
    'use strict';

    angular.module('neon', [
            'ngMaterial',
            'ngRoute',
            'ngStorage',
            'pascalprecht.translate',
            'ngSanitize',
            'btford.markdown',
            'cfp.hotkeys',
            'switchTheme',
            'toggleFullscreen',
            'start'
        ])
        .config(init);

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

        var theme = $mdThemingProvider.theme('default')
            .primaryPalette('lime')
            .accentPalette('deep-orange')
            .backgroundPalette('grey');

        $localStorageProvider.setKeyPrefix('neon');

        if ($localStorageProvider.get('theme') === 'dark') {
            theme.dark();
        }
    }
})();
