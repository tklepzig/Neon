(function() {
    'use strict';

    angular.module('neon', [
            'ngMaterial',
            'ngRoute',
            'ngStorage',
            'pascalprecht.translate',
            'ngSanitize',
            'ui.pagedown',
            'btford.socket-io',
            // 'cfp.hotkeys',
            'switchTheme',
            'toggleFullscreen',
            'editInPlace',
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


        $mdThemingProvider.definePalette('lime-dark', {
            '50': '#fffffe',
            '100': '#ebefc1',
            '200': '#dce394',
            '300': '#cad55c',
            '400': '#c2ce43',
            '500': '#b4c132',
            '600': '#9da92c',
            '700': '#879025',
            '800': '#70781f',
            '900': '#596019',
            'A100': '#fffffe',
            'A200': '#ebefc1',
            'A400': '#c2ce43',
            'A700': '#879025'
        });

        $mdThemingProvider.theme('default')
            .primaryPalette('lime-dark')
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
        if (typeof $localStorage.theme !== 'undefined' && $localStorage.theme.replace(/"/g, '') === 'default-dark') {
            $rootScope.currentTheme = 'default-dark';
        } else {
            $rootScope.currentTheme = 'default';
        }
    }
})();
