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

    function start($rootScope, $localStorage, $route, $document) {
        if (typeof $localStorage.theme !== 'undefined' && $localStorage.theme.replace(/"/g, '') === 'default-dark') {
            $rootScope.currentTheme = 'default-dark';
        } else {
            $rootScope.currentTheme = 'default';
        }


        // TODO: move this to service or similar for general usage and config (controller - key(s) - callback (with scope as parameter))
        $document.bind('keydown', function(e) {

            var inputFocused = false;
            var preventDefault = false;
            var inputNodeNames = ['input', 'select', 'textarea'];
            var element = e.target;
            var nodeName = element.nodeName.toLowerCase();

            if (element.contentEditable && element.contentEditable === 'true') {
                inputFocused = true;
            } else {
                for (var i = 0; i < inputNodeNames.length; i++) {
                    if (inputNodeNames[i] === nodeName) {
                        inputFocused = true;
                        break;
                    }
                }
            }

            //global hotkeys
            if (e.keyCode === 'S'.charCodeAt(0) && e.ctrlKey && !e.shiftKey && !e.altKey) {
                //prevent showing browser 'save as' dialog for CTRL + S lovers...
                preventDefault = true;
            }


            //controller-specific hotkeys
            switch ($route.current.$$route.controller) {
                case 'StartController':
                    {
                        if (e.keyCode === 'N'.charCodeAt(0) && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                            preventDefault = true;
                            $route.current.scope.addDocument();
                            $route.current.scope.$apply();
                        } else if (e.keyCode === 'E'.charCodeAt(0) && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                            preventDefault = true;
                            if ($route.current.scope.hoveredDocument !== null) {
                                $route.current.scope.editDocument($route.current.scope.hoveredDocument);
                                $route.current.scope.$apply();
                            }
                        }
                        break;
                    }
                case 'DocumentController':
                    {
                        if (e.keyCode === 'E'.charCodeAt(0) && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                            preventDefault = true;
                            $route.current.scope.edit();
                            $route.current.scope.$apply();
                        } else if ((e.keyCode === 13 && e.ctrlKey && !e.shiftKey && !e.altKey) || (e.keyCode === 27 && !e.ctrlKey && !e.shiftKey && !e.altKey)) {
                            preventDefault = true;
                            $route.current.scope.back();
                            $route.current.scope.$apply();
                        }
                        break;
                    }
                case 'EditController':
                    {
                        if ((e.keyCode === 13 && e.ctrlKey && !e.shiftKey && !e.altKey) || (e.keyCode === 27 && !e.ctrlKey && !e.shiftKey && !e.altKey)) {
                            preventDefault = true;
                            $route.current.scope.done();
                            $route.current.scope.$apply();
                        }
                        break;
                    }
            }


            if (preventDefault) {
                e.preventDefault();
                return false;
            }
        });

    }
})();
