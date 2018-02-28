angular.module('app.routes', [])

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider      

         .state('menu.dashboard', {
             url: '/dashboard/:PlantId/:machineId',
             cache: false,
             views: {
                 'side-menu21': {
                     templateUrl: 'templates/dashboard.html',
                     controller: 'dashboardCtrl as vm'
                 }
             }
         })

    .state('menu.downtime', {
        url: '/downtime',
        cache: false,
        views: {
            'side-menu21': {
                templateUrl: 'templates/downtime.html',
                controller: 'downtimeCtrl as vm'
            }
        }
    })

    .state('menu.partsCount', {
        url: '/partsCount',
        cache: false,
        views: {
            'side-menu21': {
                templateUrl: 'templates/partsCount.html',
                controller: 'partsCountCtrl as vm'
            }
        }
    })


    .state('menu.alarmSummary', {
        url: '/alarmSummary/:alarmNo',
        cache: false,
        views: {
            'side-menu21': {
                templateUrl: 'templates/alarmSummary.html',
                controller: 'alarmsSummaryCtrl as vm'
            }
        }
    })

    .state('menu.MachineTimings', {
        url: '/MachineTimings',
        cache: false,
        views: {
            'side-menu21': {
                templateUrl: 'templates/MachineTimings.html',
                controller: 'machineTimeCtrl as vm'
            }
        }
    })

  .state('menu.plants', {
      url: '/plants',
      cache: false,
      views: {
          'side-menu21': {
              templateUrl: 'templates/plants.html',
              controller: 'plantsCtrl as vm'
          }
      }
  })
 .state('menu.plantMachineInfo', {
     url: '/plantMachineInfo/:PlantId',
          cache: false,
          views: {
              'side-menu21': {
                  templateUrl: 'templates/plantMachineInfo.html',
                  controller: 'plantMachineCtrl as vm'
              }
          }
      })

    .state('menu.alarmSolution', {
        url: '/alarmSolution/:alarmNo',
        cache: false,
        views: {
            'side-menu21': {
                templateUrl: 'templates/alarmSolution.html',
                controller: 'alarmSolution as vm'
            }
        }
    })

   .state('menu.programTransfer', {
     url: '/programTransfer',
     cache: false,
     views: {
         'side-menu21': {
             templateUrl: 'templates/programTransfer.html',
             controller: 'programTransferCtrl as vm'
         }
     }
   })

   .state('menu.setting', {
              url: '/setting',
              cache: false,
              views: {
                  'side-menu21': {
                      templateUrl: 'templates/setting.html',
                      controller: 'settingCtrl as vm'
                  }
              }
   })
         .state('menu.syncData', {
             url: '/syncData',
             cache: false,
             views: {
                 'side-menu21': {
                     templateUrl: 'templates/syncData.html',
                     controller: 'syncDataCtrl as vm'
                 }
             }
         })

    .state('menu.partCountChart', {
        url: '/partCountChart',
        cache: false,
        views: {
            'side-menu21': {
                templateUrl: 'templates/partCountChart.html',
                controller: 'partCountChartCtrl as vm'
            }
        }
    })
        .state('menu.timeChart', {
            url: '/timeChart',
            cache: false,
            views: {
                'side-menu21': {
                    templateUrl: 'templates/timeChart.html',
                    controller: 'timeChartCtrl as vm'
                }
            }
        })
 
        .state('menu.alarmDetails', {
            url: '/alarmDetails',
            cache: false,
            views: {
                'side-menu21': {
                    templateUrl: 'templates/alarmDetails.html',
                    controller: 'alarmsDetailsCtrl as vm'
                }
            }
        })
         .state('menu.Statistics', {
             url: '/Statistics',
             cache: false,
             views: {
                 'side-menu21': {
                     templateUrl: 'templates/Statistics.html',
                     controller: 'statisticsCtrl as vm'
                 }
             }
         })
    .state('menu', {
        url: '/side-menu21',
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl'
    })

  $urlRouterProvider.otherwise('/side-menu21/plants')



});