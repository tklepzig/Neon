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
            'neon.touch',
            'toggleFullscreen',
            'editInPlace',
            'zoomable',
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
        $translateProvider.preferredLanguage('en-GB');
        $translateProvider.fallbackLanguage('en-GB');

        $mdThemingProvider.definePalette('dark-brown', {
            '50': '#ffb830',
            '100': '#e39500',
            '200': '#ab7000',
            '300': '#634100',
            '400': '#452d00',
            '500': '#261900',
            '600': '#070500',
            '700': '#000000',
            '800': '#000000',
            '900': '#000000',
            'A100': '#ffb830',
            'A200': '#e39500',
            'A400': '#452d00',
            'A700': '#000000',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': '50 100 A100 A200'
        });

        $mdThemingProvider.definePalette('dark-brown-2', {
            '50': '#ffb522',
            '100': '#d58e00',
            '200': '#9d6800',
            '300': '#553900',
            '400': '#372400',
            '500': '#181000',
            '600': '#000000',
            '700': '#000000',
            '800': '#000000',
            '900': '#000000',
            'A100': '#ffb522',
            'A200': '#d58e00',
            'A400': '#372400',
            'A700': '#000000',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': '50 100 A100 A200'
        });

        $mdThemingProvider.definePalette('light-green', {
            '50': '#ebffc4',
            '100': '#d2ff78',
            '200': '#bfff40',
            '300': '#a5f700',
            '400': '#90d900',
            '500': '#7cba00',
            '600': '#689b00',
            '700': '#537d00',
            '800': '#3f5e00',
            '900': '#2a4000',
            'A100': '#ebffc4',
            'A200': '#d2ff78',
            'A400': '#90d900',
            'A700': '#537d00',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': '50 100 200 300 400 500 A100 A200 A400'
        });

        $mdThemingProvider.definePalette('light-orange', {
            '50': '#fff0d2',
            '100': '#ffd686',
            '200': '#ffc34e',
            '300': '#ffaa06',
            '400': '#e79800',
            '500': '#c88400',
            '600': '#a97000',
            '700': '#8b5c00',
            '800': '#6c4700',
            '900': '#4e3300',
            'A100': '#fff0d2',
            'A200': '#ffd686',
            'A400': '#e79800',
            'A700': '#8b5c00',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': '50 100 200 300 400 500 A100 A200 A400'
        });

        $mdThemingProvider.theme('default')
            .primaryPalette('light-green')
            .accentPalette('light-orange')
            .backgroundPalette('dark-brown-2', {
                default: '500'
            }).dark();

        $localStorageProvider.setKeyPrefix('neon');
    }

    function start($localStorage, $route, $document) {
        // TODO: move this to service or similar for general usage and config (controller - key(s) - callback (with scope as parameter))
        $document.bind('keydown', function(e) {

            var inputElementHasFocus = false;
            var preventDefault = false;
            var inputNodeNames = ['input', 'select', 'textarea'];
            var element = e.target;
            var nodeName = element.nodeName.toLowerCase();

            if (element.contentEditable && element.contentEditable === 'true') {
                inputElementHasFocus = true;
            } else {
                for (var i = 0; i < inputNodeNames.length; i++) {
                    if (inputNodeNames[i] === nodeName) {
                        inputElementHasFocus = true;
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
                        if ((e.keyCode === 'N'.charCodeAt(0) || e.keyCode === 'D'.charCodeAt(0)) && !inputElementHasFocus && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                            preventDefault = true;
                            $route.current.scope.addDocument();
                            $route.current.scope.$apply();
                        } else if (e.keyCode === 'G'.charCodeAt(0) && !inputElementHasFocus && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                            preventDefault = true;
                            $route.current.scope.addGroup();
                            $route.current.scope.$apply();
                        } else if (e.keyCode === 'E'.charCodeAt(0) && !inputElementHasFocus && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                            preventDefault = true;
                            if ($route.current.scope.hoveredDocument !== null) {
                                $route.current.scope.editDocument($route.current.scope.hoveredDocument);
                                $route.current.scope.$apply();
                            }
                        } else if (e.keyCode === 'S'.charCodeAt(0) && !inputElementHasFocus && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                            preventDefault = true;
                            if (!$route.current.scope.showSearch) {
                                $route.current.scope.startSearch();
                                $route.current.scope.$apply();
                            }
                        } else if ((e.keyCode === 27 && !e.ctrlKey && !e.shiftKey && !e.altKey)) {
                            preventDefault = true;

                            if ($route.current.scope.showSearch) {
                                $route.current.scope.endSearch();
                                $route.current.scope.$apply();
                            }
                        }
                        break;
                    }
                case 'GroupController':
                    {
                        if ((e.keyCode === 'N'.charCodeAt(0) || e.keyCode === 'D'.charCodeAt(0)) && !inputElementHasFocus && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                            preventDefault = true;
                            $route.current.scope.addDocument();
                            $route.current.scope.$apply();
                        } else if (e.keyCode === 'G'.charCodeAt(0) && !inputElementHasFocus && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                            preventDefault = true;
                            $route.current.scope.addGroup();
                            $route.current.scope.$apply();
                        } else if (e.keyCode === 27 && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                            preventDefault = true;
                            $route.current.scope.back();
                            $route.current.scope.$apply();
                        }
                        break;
                    }
                case 'DocumentController':
                    {
                        if (e.keyCode === 'E'.charCodeAt(0) && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                            preventDefault = true;
                            $route.current.scope.edit();
                            $route.current.scope.$apply();
                        } else if (e.keyCode === 27 && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                            preventDefault = true;
                            $route.current.scope.back();
                            $route.current.scope.$apply();
                        }
                        break;
                    }
                case 'EditController':
                    {
                        if (((e.keyCode === 13 && e.ctrlKey) || (e.keyCode === 27 && !e.ctrlKey)) && !e.shiftKey && !e.altKey) {
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
