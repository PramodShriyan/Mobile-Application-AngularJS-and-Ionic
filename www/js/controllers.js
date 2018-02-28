angular.module('app.controllers', [])

.factory("sharedService", function ($rootScope) {
    var mySharedService = {};
    mySharedService.passData = function () {
        $rootScope.getDatetime = new Date();
    }
    return mySharedService;
})
 .controller('plantsCtrl', ['$state', '$scope', '$stateParams', 'mConnectAPI', '$ionicHistory', '$ionicPopup', '$ionicPlatform', 'sharedService', '$rootScope', '$cordovaNetwork', '$cordovaDatePicker', '$filter', 'ionicDatePicker',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($state, $scope, $stateParams, mConnectAPI, $ionicHistory, $ionicPopup, $ionicPlatform, sharedService, $rootScope, $cordovaNetwork, $cordovaPinDialog, $filter, ionicDatePicker) {
    sharedService.passData();

    var vm = this;
    if ($rootScope.selectedDATE == undefined || $rootScope.selectedDATE == null) {
        $rootScope.selectedDATE = $filter('date')(new Date(), 'yyyy-MM-dd');
    }
    var tdy = new Date();
    var minDate = new Date(tdy.setDate(tdy.getDate() - 27));
    var maxDate = new Date();
    var ipObj1 = {
        callback: function (val) {
            var electedDate = new Date(val);
            debugger;
            var sdate = $filter('date')(electedDate, 'yyyy-MM-dd');
            $rootScope.selectedDATE = sdate;
            vm.dates = mConnectAPI.getDates(sdate);
            mConnectAPI.selectedDate = vm.dates[2].dateValue;
            var index = _.findIndex(vm.dates, { 'dateValue': mConnectAPI.selectedDate });
            vm.selectedIndex = index;
            loaddata();
        },
        titleLabel: 'Select a Date',
        showTodayButton: true,
        from: minDate,
        to: maxDate,
        templateType: 'popup'
    };
    vm.passDate = function () {
        debugger;
        ionicDatePicker.openDatePicker(ipObj1);

    };
    debugger;

    vm.dates = mConnectAPI.getDates($rootScope.selectedDATE);//
    var index = _.findIndex(vm.dates, { 'dateValue': mConnectAPI.selectedDate });
    vm.selectedIndex = index;
    function loaddata() {
        var selectedDate = mConnectAPI.selectedDate;
        mConnectAPI.refreshData(selectedDate).then(function () {
            console.log("All data got from http", new Date());

            vm.PlantData = mConnectAPI.getAllPlants();
            vm.hidePlant = mConnectAPI.hidePlant();
            if (vm.hidePlant == true) {
                var plantId = mConnectAPI.getAllPlants()[0].plantID;
                mConnectAPI.selectedPlantId = plantId;
                var machineInfo = mConnectAPI.getMachinesForPlant(plantId);
                if (machineInfo.machines.length > 0) {
                    var machineId = machineInfo.machines[0].machineID;
                    mConnectAPI.selectedMachineId = machineId;
                }
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go("menu.dashboard", { showOnlyOneMachine: 'ACE-01' });
            }

        }, function () {
            console.log("Error getting data. Putting expired item back in the cache.", new Date());
            alert("not able to get data");
        });

    }
    vm.clickDateEvent = function (dateValue, $index) {
        debugger;
        var dd = dateValue.split("-");
        $rootScope.currentDate = dd[2];
        if (dd[2] != vm.CurrDate) {
            vm.machineStatusHide = 1;
        }
        else {
            vm.machineStatusHide = 0;
        }

        sharedService.passData();
        mConnectAPI.selectedDate = dateValue;
        loaddata();
        vm.selectedIndex = $index;

    };
    $ionicPlatform.ready(function () {
        //var userDetails = deviceNameFull + "," + macaddress;
        //alert("In controller" + userDetails);
        loaddata();
    });
    $ionicPlatform.registerBackButtonAction(function (e) {
        e.preventDefault();
        function showConfirm() {
            var confirmPopup = $ionicPopup.show({
                title: 'Exit MachineConnect?',
                template: 'Are you sure want to exit MachineConnect?',
                buttons: [{
                    text: 'Cancel',
                    type: 'button-positive button-outline',
                }, {
                    text: 'Ok',
                    type: 'button-positive',
                    onTap: function () {
                        ionic.Platform.exitApp();
                    }
                }]
            });
        };
        // Is there a page to go back to?
        if ($ionicHistory.backView()) {
            // Go back in history
            $ionicHistory.backView().go();
        } else {
            // This is the last page: Show confirmation popup
            showConfirm();
        }
        return false;
    }, 101);

}])
 .controller('plantMachineCtrl', ['$state', '$scope', '$stateParams', 'mConnectAPI', 'sharedService', '$ionicPopup', '$rootScope', '$filter', 'ionicDatePicker', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($state, $scope, $stateParams, mConnectAPI, sharedService, $ionicPopup, $rootScope, $filter, ionicDatePicker) {
    var vm = this;
    debugger;
    vm.CurrDate = new Date().getDate();
    vm.dates = mConnectAPI.getDates($rootScope.selectedDATE);

    var tdy = new Date();
    var minDate = new Date(tdy.setDate(tdy.getDate() - 27));
    var maxDate = new Date();
    var ipObj1 = {
        callback: function (val) {
            var electedDate = new Date(val);
            debugger;
            var sdate = $filter('date')(electedDate, 'yyyy-MM-dd');
            $rootScope.selectedDATE = sdate;
            vm.dates = mConnectAPI.getDates(sdate);
            mConnectAPI.selectedDate = vm.dates[2].dateValue;
            var index = _.findIndex(vm.dates, { 'dateValue': mConnectAPI.selectedDate });
            vm.selectedIndex = index;
            if (vm.dates[2].dateText != vm.CurrDate) {
                vm.machineStatusHide = 1;
            }
            else {
                vm.machineStatusHide = 0;
            }
            loaddata();
        },
        titleLabel: 'Select a Date',
        showTodayButton: true,
        from: minDate,
        to: maxDate,
        templateType: 'popup'
    };
    vm.passDate = function () {
        ionicDatePicker.openDatePicker(ipObj1);

    };

    var selectedPlant = Number($stateParams.PlantId);
    if (selectedPlant > 0)
        mConnectAPI.selectedPlantId = selectedPlant;
    else
        mConnectAPI.selectedPlantId = mConnectAPI.getAllPlants()[0].plantID;
    mConnectAPI.selectedMachineId = 0;
    var index = _.findIndex(vm.dates, { 'dateValue': mConnectAPI.selectedDate });
    vm.selectedIndex = index;

    if (vm.dates[2].dateText != vm.CurrDate) {
        vm.machineStatusHide = 1;
    }
    else {
        if (vm.selectedIndex == 2) {
            vm.machineStatusHide = 0;
        }
        else {
            vm.machineStatusHide = 1;
        }
    }

    var plnatMachineInfo = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
    if (plnatMachineInfo) {
        vm.plantData = plnatMachineInfo;
    }
    else
        vm.plantData = {};

    vm.clickDateEvent = function (dateValue, $index) {
        debugger;
        var dd = dateValue.split("-");
        $rootScope.currentDate = dd[2];
        if (dd[2] != vm.CurrDate) {
            vm.machineStatusHide = 1;
        }
        else {
            vm.machineStatusHide = 0;
        }
        sharedService.passData();
        mConnectAPI.selectedDate = dateValue;
        loaddata();
        vm.selectedIndex = $index;
    }
    function loaddata() {
        debugger;
        mConnectAPI.refreshData(mConnectAPI.selectedDate).then(function () {
            console.log("All data got from http", new Date());
            plnatMachineInfo = vm.plantData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
            //alert("plantinfo: "+plnatMachineInfo);
            if (plnatMachineInfo)
                vm.plantData = plnatMachineInfo
            else
                vm.plantData = {};

        }, function () {
            console.log("Error getting data. Putting expired item back in the cache.", new Date());
            alert("not able to get data");
        });
    }
}])
.controller('dashboardCtrl', ['$state', '$scope', '$stateParams', 'mConnectAPI', 'sharedService', '$rootScope', '$filter', 'ionicDatePicker',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($state, $scope, $stateParams, mConnectAPI, sharedService, $rootScope, $filter, ionicDatePicker) {
    var vm = this;
    debugger;
    vm.CurrDate = new Date().getDate();
    vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);

    var tdy = new Date();
    var minDate = new Date(tdy.setDate(tdy.getDate() - 27));
    var maxDate = new Date();
    var ipObj1 = {
        callback: function (val) {
            var electedDate = new Date(val);
            debugger;
            var sdate = $filter('date')(electedDate, 'yyyy-MM-dd');
            $rootScope.selectedDATE = sdate;
            vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);
            mConnectAPI.selectedDate = vm.getDates[2].dateValue;
            var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
            vm.selectedIndex = index;
            if (vm.getDates[2].dateText != vm.CurrDate) {
                vm.machineStatusHide = 1;
            }
            else {
                vm.machineStatusHide = 0;
            }
            loaddata();
        },
        titleLabel: 'Select a Date',
        showTodayButton: true,
        from: minDate,
        to: maxDate,
        templateType: 'popup'
    };
    vm.passDate = function () {
        ionicDatePicker.openDatePicker(ipObj1);

    };

    var selectedDate = mConnectAPI.selectedDate;
    var index = _.findIndex(vm.getDates, { 'dateValue': selectedDate });
    var plantID = Number($stateParams.PlantId);
    var machineId = Number($stateParams.machineId);
    vm.hidePlant = mConnectAPI.hidePlant();
    if (mConnectAPI.selectedMachineId > 0)
        mConnectAPI.selectedMachineId = mConnectAPI.selectedMachineId;
    else
        mConnectAPI.selectedMachineId = machineId;

    if (plantID == 0)
        mConnectAPI.selectedPlantId = mConnectAPI.getAllPlants()[0].plantID;
    vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
    vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
    vm.selectedValue = mConnectAPI.selectedMachineId;
    //vm.selectedOption = vm.machineData.machines[0].machineID;
    vm.getShiftData = mConnectAPI.getAllShifts();
    vm.plantName = vm.machineData.plantName;
    vm.alarmTotal = mConnectAPI.alarmlen;
    var dashboard = mConnectAPI.getDashboardData(selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
    if (dashboard)
        vm.DashboardData = dashboard;
    else
        vm.DashboardData = {};
    $scope.gotoPage = function (name) {
        //alert(name);
        //TODO
        $state.go(name);
    }

    function updateTime() {

    }
    function loaddata() {
        mConnectAPI.refreshData(mConnectAPI.selectedDate).then(function () {
            debugger;
            console.log("All data got from http", new Date());
            vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
            vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
            dashboard = vm.DashboardData = mConnectAPI.getDashboardData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
            //alert("dashboard: "+dashboard);
            if (dashboard)
                vm.DashboardData = dashboard;
            else
                vm.DashboardData = {};

        }, function () {
            console.log("Error getting data. Putting expired item back in the cache.", new Date());
            alert("not able to get data");
        });

    }
    vm.selectedIndex = index;

    if (vm.getDates[2].dateText != vm.CurrDate) {
        vm.machineStatusHide = 1;
    }
    else {
        if (vm.selectedIndex == 2) {
            vm.machineStatusHide = 0;
        }
        else {
            vm.machineStatusHide = 1;
        }
    }


    vm.clickDateEvent = function (dateValue, $index) {
        debugger;
        var dd = dateValue.split("-");
        $rootScope.currentDate = dd[2];
        if (dd[2] != vm.CurrDate) {
            vm.machineStatusHide = 1;
        }
        else {
            vm.machineStatusHide = 0;
        }
        sharedService.passData();
        mConnectAPI.selectedDate = dateValue;
        loaddata();

        vm.selectedIndex = $index;
    }
    vm.onChange = function (machineId) {
        mConnectAPI.selectedMachineId = machineId;
        vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
        dashboard = mConnectAPI.getDashboardData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
        if (dashboard)
            vm.DashboardData = dashboard;
        else
            vm.DashboardData = {};
    }
    $scope.alarmPage = function () {
        $state.go("menu.alarmSummary");
    }

}])
  .controller('partsCountCtrl', ['$state', '$scope', '$stateParams', 'mConnectAPI', 'sharedService', '$rootScope', '$filter', 'ionicDatePicker',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($state, $scope, $stateParams, mConnectAPI, sharedService, $rootScope, $filter, ionicDatePicker) {
    var vm = this;

    vm.CurrDate = new Date().getDate();
    vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);
    var tdy = new Date();
    var minDate = new Date(tdy.setDate(tdy.getDate() - 27));
    var maxDate = new Date();
    var ipObj1 = {
        callback: function (val) {
            var electedDate = new Date(val);
            debugger;
            var sdate = $filter('date')(electedDate, 'yyyy-MM-dd');
            $rootScope.selectedDATE = sdate;
            vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);
            mConnectAPI.selectedDate = vm.getDates[2].dateValue;
            var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
            vm.selectedIndexDate = index;
            if (vm.getDates[2].dateText != vm.CurrDate) {
                vm.machineStatusHide = 1;
            }
            else {
                vm.machineStatusHide = 0;
            }
            loaddata();
        },
        titleLabel: 'Select a Date',
        showTodayButton: true,
        from: minDate,
        to: maxDate,
        templateType: 'popup'
    };
    vm.passDate = function () {
        ionicDatePicker.openDatePicker(ipObj1);

    };
    var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
    vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
    if (mConnectAPI.selectedMachineId == 0)
        mConnectAPI.selectedMachineId = vm.machineData.machines[0].machineID;
    vm.selectedValue = mConnectAPI.selectedMachineId;
    vm.plantName = vm.machineData.plantName;
    vm.getShiftData = mConnectAPI.getAllShifts();
    vm.selectedIndexDate = index;

    vm.selectedIndex = mConnectAPI.selectedshift;
    vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
    vm.hidePlant = mConnectAPI.hidePlant();
    var partcnt = mConnectAPI.getPartsCountData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
    if (partcnt)
        vm.partscntData = partcnt[vm.selectedIndex];
    else
        vm.partscntData = {};

    if (vm.getDates[2].dateText != vm.CurrDate) {
        vm.machineStatusHide = 1;
    }
    else {
        if (vm.selectedIndexDate == 2) {
            vm.machineStatusHide = 0;
        }
        else {
            vm.machineStatusHide = 1;
        }
    }

    vm.clickDateEvent = function (dateValue, $index) {
        var dd = dateValue.split("-");
        $rootScope.currentDate = dd[2];
        if (dd[2] != vm.CurrDate) {
            vm.machineStatusHide = 1;
        }
        else {
            vm.machineStatusHide = 0;
        }
        sharedService.passData();
        mConnectAPI.selectedDate = dateValue;
        loaddata();
        vm.selectedIndexDate = $index;
    }
    function loaddata() {
        mConnectAPI.refreshData(mConnectAPI.selectedDate).then(function () {
            console.log("All data got from http", new Date());
            vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
            vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
            partcnt = mConnectAPI.getPartsCountData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
            if (partcnt)
                vm.partscntData = partcnt[vm.selectedIndex];
            else
                vm.partscntData = {};

        }, function () {
            console.log("Error getting data. Putting expired item back in the cache.", new Date());
            alert("not able to get data");
        });
    }
    vm.onMachineSelectionChange = function (machineId) {

        mConnectAPI.selectedMachineId = machineId;
        vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
        partcnt = mConnectAPI.getPartsCountData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
        if (partcnt)
            vm.partscntData = partcnt[vm.selectedIndex];
        else
            vm.partscntData = {};
    }
    vm.shiftButtonClick = function (shiftparts, $index) {
        mConnectAPI.selectedshift = $index;
        vm.partscntData = _.find(partcnt, { 'shiftId': Number(shiftparts) });
        vm.selectedIndex = $index;
    }
    $scope.pcChart = function () {
        $state.go("menu.partCountChart");
    }
    $scope.statisticsPage = function () {
        $state.go("menu.Statistics");
    }


    $scope.alarmPage = function () {
        $state.go("menu.alarmSummary");
    }
}])
  .controller('machineTimeCtrl', ['$state', '$scope', '$stateParams', 'mConnectAPI', 'sharedService', '$rootScope', '$filter', 'ionicDatePicker',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($state, $scope, $stateParams, mConnectAPI, sharedService, $rootScope, $filter, ionicDatePicker) {
    var vm = this;

    vm.CurrDate = new Date().getDate();
    vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);
    var tdy = new Date();
    var minDate = new Date(tdy.setDate(tdy.getDate() - 27));
    var maxDate = new Date();
    var ipObj1 = {
        callback: function (val) {
            var electedDate = new Date(val);
            debugger;
            var sdate = $filter('date')(electedDate, 'yyyy-MM-dd');
            $rootScope.selectedDATE = sdate;
            vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);
            mConnectAPI.selectedDate = vm.getDates[2].dateValue;
            var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
            vm.selectedIndexDate = index;
            if (vm.getDates[2].dateText != vm.CurrDate) {
                vm.machineStatusHide = 1;
            }
            else {
                vm.machineStatusHide = 0;
            }
            loaddata();
        },
        titleLabel: 'Select a Date',
        showTodayButton: true,
        from: minDate,
        to: maxDate,
        templateType: 'popup'
    };
    vm.passDate = function () {
        ionicDatePicker.openDatePicker(ipObj1);

    };
    var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
    vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
    vm.hidePlant = mConnectAPI.hidePlant();
    if (mConnectAPI.selectedMachineId == 0)
        mConnectAPI.selectedMachineId = vm.machineData.machines[0].machineID;
    vm.selectedValue = mConnectAPI.selectedMachineId;
    vm.plantName = vm.machineData.plantName;
    vm.hidePlant = mConnectAPI.hidePlant();
    vm.getShiftData = mConnectAPI.getAllShifts();
    vm.selectedIndexDate = index;
    vm.selectedIndex = mConnectAPI.selectedshift;
    vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
    var timingData = mConnectAPI.getTimesData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
    if (timingData)
        vm.machineTimeData = timingData[vm.selectedIndex];
    else
        vm.machineTimeData = {};
    if (vm.getDates[2].dateText != vm.CurrDate) {
        vm.machineStatusHide = 1;
    }
    else {

        if (vm.selectedIndexDate == 2) {
            vm.machineStatusHide = 0;
        }
        else {
            vm.machineStatusHide = 1;
        }
    }

    vm.clickDateEvent = function (dateValue, $index) {
        var dd = dateValue.split("-");
        $rootScope.currentDate = dd[2];
        if (dd[2] != vm.CurrDate) {
            vm.machineStatusHide = 1;
        }
        else {
            vm.machineStatusHide = 0;
        }
        sharedService.passData();
        mConnectAPI.selectedDate = dateValue;
        loaddata();
        vm.selectedIndexDate = $index;

    }
    function loaddata() {
        mConnectAPI.refreshData(mConnectAPI.selectedDate).then(function () {
            console.log("All data got from http", new Date());
            vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
            vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
            timingData = mConnectAPI.getTimesData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
            if (timingData)
                vm.machineTimeData = timingData[vm.selectedIndex];
            else
                vm.machineTimeData = {};
        }, function () {
            console.log("Error getting data. Putting expired item back in the cache.", new Date());
            alert("not able to get data");
        });
    }
    vm.onMachineSelectionChange = function (machineId) {

        mConnectAPI.selectedMachineId = machineId;
        vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
        timingData = mConnectAPI.getTimesData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
        if (timingData)
            vm.machineTimeData = timingData[vm.selectedIndex];
        else
            vm.machineTimeData = {};
    }
    vm.machineTimingShift = function (shift, $index) {
        mConnectAPI.selectedshift = $index;
        vm.machineTimeData = _.find(timingData, { 'shiftId': Number(shift) });
        vm.selectedIndex = $index;
    }
    $scope.mTchart = function () {
        $state.go("menu.timeChart");
    }
    $scope.alarmPage = function () {

        $state.go("menu.alarmSummary");
    }
}])
.controller('downtimeCtrl', ['$state', '$scope', '$stateParams', 'mConnectAPI', 'sharedService', '$rootScope', '$filter', 'ionicDatePicker', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($state, $scope, $stateParams, mConnectAPI, sharedService, $rootScope, $filter, ionicDatePicker) {
    var vm = this;

    $scope.orderByField = 'duration';
    $scope.reverseSort = false;
    vm.CurrDate = new Date().getDate();
    vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);
    var tdy = new Date();
    var minDate = new Date(tdy.setDate(tdy.getDate() - 27));
    var maxDate = new Date();
    var ipObj1 = {
        callback: function (val) {
            var electedDate = new Date(val);
            debugger;
            var sdate = $filter('date')(electedDate, 'yyyy-MM-dd');
            $rootScope.selectedDATE = sdate;
            vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);
            mConnectAPI.selectedDate = vm.getDates[2].dateValue;
            var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
            vm.selectedIndexDate = index;
            if (vm.getDates[2].dateText != vm.CurrDate) {
                vm.machineStatusHide = 1;
            }
            else {
                vm.machineStatusHide = 0;
            }
            loaddata();
        },
        titleLabel: 'Select a Date',
        showTodayButton: true,
        from: minDate,
        to: maxDate,
        templateType: 'popup'
    };
    vm.passDate = function () {
        ionicDatePicker.openDatePicker(ipObj1);

    };
    debugger;
    var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
    vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
    vm.hidePlant = mConnectAPI.hidePlant();
    if (mConnectAPI.selectedMachineId == 0)
        mConnectAPI.selectedMachineId = vm.machineData.machines[0].machineID;
    vm.selectedValue = mConnectAPI.selectedMachineId;
    vm.plantName = vm.machineData.plantName;
    vm.selectedIndexDate = index;
    vm.selectedIndex = mConnectAPI.selectedshift;
    vm.getShiftData = mConnectAPI.getAllShifts();
    vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
    var downTime = mConnectAPI.getStoppagesData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
    if (downTime)
        vm.downTimeData = downTime[vm.selectedIndex];
    else
        vm.downTimeData = {};
    if (vm.getDates[2].dateText != vm.CurrDate) {
        vm.machineStatusHide = 1;
    }
    else {
        if (vm.selectedIndexDate == 2) {
            vm.machineStatusHide = 0;
        }
        else {
            vm.machineStatusHide = 1;
        }
    }

    vm.clickDateEvent = function (dateValue, $index) {
        var dd = dateValue.split("-");
        $rootScope.currentDate = dd[2];
        if (dd[2] != vm.CurrDate) {
            vm.machineStatusHide = 1;
        }
        else {
            vm.machineStatusHide = 0;
        }
        sharedService.passData();
        mConnectAPI.selectedDate = dateValue;
        loaddata();
        vm.selectedIndexDate = $index;
    }
    function loaddata() {
        mConnectAPI.refreshData(mConnectAPI.selectedDate).then(function () {
            console.log("All data got from http", new Date());
            vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
            vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
            downTime = mConnectAPI.getStoppagesData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
            if (downTime)
                vm.downTimeData = downTime[vm.selectedIndex];
            else
                vm.downTimeData = {};
        }, function () {
            console.log("Error getting data. Putting expired item back in the cache.", new Date());
            alert("not able to get data");
        });
    }
    vm.onMachineSelectionChange = function (machineId) {

        mConnectAPI.selectedMachineId = machineId;
        vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
        downTime = mConnectAPI.getStoppagesData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
        if (downTime)
            vm.downTimeData = downTime[vm.selectedIndex];
        else
            vm.downTimeData = {};

    }
    vm.stoppageTimingShift = function (shiftst, $index) {
        mConnectAPI.selectedshift = $index;
        vm.downTimeData = _.find(downTime, { 'shiftId': Number(shiftst) });
        vm.selectedIndex = $index;
    }
    $scope.alarmPage = function () {
        $state.go("menu.alarmSummary");
    }
    $scope.orderByField = 'duration';
    $scope.reverseSort = false;


}])
.controller('alarmsDetailsCtrl', ['$state', '$scope', '$stateParams', 'mConnectAPI', '$rootScope', '$filter', 'ionicDatePicker',  // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($state, $scope, $stateParams, mConnectAPI, $rootScope, $filter, ionicDatePicker) {
    var vm = this;
    debugger;
    vm.CurrDate = new Date().getDate();
    vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);
    var tdy = new Date();
    var minDate = new Date(tdy.setDate(tdy.getDate() - 27));
    var maxDate = new Date();
    var ipObj1 = {
        callback: function (val) {
            var electedDate = new Date(val);
            debugger;
            var sdate = $filter('date')(electedDate, 'yyyy-MM-dd');
            $rootScope.selectedDATE = sdate;
            vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);
            mConnectAPI.selectedDate = vm.getDates[2].dateValue;
            var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
            vm.selectedIndexDate = index;
            if (vm.getDates[2].dateText != vm.CurrDate) {
                vm.machineStatusHide = 1;
            }
            else {
                vm.machineStatusHide = 0;
            }
            loaddata();
        },
        titleLabel: 'Select a Date',
        showTodayButton: true,
        from: minDate,
        to: maxDate,
        templateType: 'popup'
    };
    vm.passDate = function () {
        ionicDatePicker.openDatePicker(ipObj1);

    };
    var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
    vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
    vm.hidePlant = mConnectAPI.hidePlant();
    if (mConnectAPI.selectedMachineId == 0)
        mConnectAPI.selectedMachineId = vm.machineData.machines[0].machineID;
    vm.selectedValue = mConnectAPI.selectedMachineId;
    vm.plantName = vm.machineData.plantName;
    vm.selectedIndexDate = index;
    vm.selectedIndex = mConnectAPI.selectedshift;
    vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
    vm.getShiftData = mConnectAPI.getAllShifts();
    var getAlarm = mConnectAPI.getAlarmsDetails(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
    if (getAlarm)
        vm.alarmData = getAlarm[vm.selectedIndex];
    else
        vm.alarmData = {};
    if (vm.getDates[2].dateText != vm.CurrDate) {
        vm.machineStatusHide = 1;
    }
    else {
        if (vm.selectedIndexDate == 2) {
            vm.machineStatusHide = 0;
        }
        else {
            vm.machineStatusHide = 1;
        }
    }

    vm.clickDateEvent = function (dateValue, $index) {
        var dd = dateValue.split("-");
        $rootScope.currentDate = dd[2];
        if (dd[2] != vm.CurrDate) {
            vm.machineStatusHide = 1;
        }
        else {
            vm.machineStatusHide = 0;
        }
        mConnectAPI.selectedDate = dateValue;
        loaddata();
        vm.selectedIndexDate = $index;
    }

    function loaddata() {
        mConnectAPI.refreshData(mConnectAPI.selectedDate).then(function () {
            console.log("All data got from http", new Date());
            vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
            vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
            getAlarm = mConnectAPI.getAlarmsDetails(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
            if (getAlarm)
                vm.alarmData = getAlarm[vm.selectedIndex];
            else
                vm.alarmData = {};
        }, function () {
            console.log("Error getting data. Putting expired item back in the cache.", new Date());
            alert("not able to get data");
        });
    }

    vm.onMachineSelectionChange = function (machineId) {

        mConnectAPI.selectedMachineId = machineId;
        vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
        getAlarm = mConnectAPI.getAlarmsDetails(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
        if (getAlarm)
            vm.alarmData = getAlarm[vm.selectedIndex];
        else
            vm.alarmData = {};

    }

    vm.shiftButtonClick = function (shiftparts, $index) {
        mConnectAPI.selectedshift = $index;
        vm.alarmData = _.find(getAlarm, { 'shiftId': Number(shiftparts) });
        vm.selectedIndex = $index;
    }

    $scope.mTchart = function () {
        $state.go('menu.alarmSummary');
    }
}])
 .controller('alarmSolution', ['$state', '$scope', '$stateParams', 'mConnectAPI', '$http', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($state, $scope, $stateParams, mConnectAPI, $http) {
    var vm = this;
    debugger;

    vm.CurrDate = new Date().getDate();
    vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
    vm.machineMTB = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })

    //vm.getDates = mConnectAPI.getDates();
    //var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
    //vm.hidePlant = mConnectAPI.hidePlant();
    //if (mConnectAPI.selectedMachineId == 0)
    //    mConnectAPI.selectedMachineId = vm.machineData.machines[0].machineID;
    //vm.selectedValue = mConnectAPI.selectedMachineId;
    //vm.plantName = vm.machineData.plantName;
    //vm.selectedIndexDate = index;
    vm.alrmSolutionData = mConnectAPI.getAlarmsSolutionData($stateParams.alarmNo, vm.machineMTB.machineMTB);
    // var modal = document.getElementById('myModal');

    // vm.data = vm.alrmSolutionData.mtb;
    //alert(vm.data);
    //vm.modalImg = "";
    //$scope.open = function (index, alarmNo, mtbPath) {
    //    modal.style.display = "block";             
    //    vm.modalImg = "img/" + mtbPath + "/Alarms/" + alarmNo + "/" + alarmNo + "_" + index + ".png";       
    //} 
    //var span = document.getElementsByClassName("close")[0];
    //span.onclick = function () {
    //    modal.style.display = "none";
    //}

}])
.controller('timeChartCtrl', ['$state', '$scope', '$stateParams', 'mConnectAPI', 'sharedService', '$rootScope', '$filter', 'ionicDatePicker', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($state, $scope, $stateParams, mConnectAPI, sharedService, $rootScope, $filter, ionicDatePicker) {
    var vm = this;
    vm.CurrDate = new Date().getDate();
    vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);
    var tdy = new Date();
    var minDate = new Date(tdy.setDate(tdy.getDate() - 27));
    var maxDate = new Date();
    var ipObj1 = {
        callback: function (val) {
            var electedDate = new Date(val);
            debugger;
            var sdate = $filter('date')(electedDate, 'yyyy-MM-dd');
            $rootScope.selectedDATE = sdate;
            vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);
            mConnectAPI.selectedDate = vm.getDates[2].dateValue;
            var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
            vm.selectedIndexDate = index;
            if (vm.getDates[2].dateText != vm.CurrDate) {
                vm.machineStatusHide = 1;
            }
            else {
                vm.machineStatusHide = 0;
            }
            loaddata();
        },
        titleLabel: 'Select a Date',
        showTodayButton: true,
        from: minDate,
        to: maxDate,
        templateType: 'popup'
    };
    vm.passDate = function () {
        ionicDatePicker.openDatePicker(ipObj1);

    };
    var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
    vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
    vm.hidePlant = mConnectAPI.hidePlant();
    if (mConnectAPI.selectedMachineId == 0)
        mConnectAPI.selectedMachineId = vm.machineData.machines[0].machineID;
    vm.selectedValue = mConnectAPI.selectedMachineId;
    vm.plantName = vm.machineData.plantName;
    vm.selectedIndex = mConnectAPI.selectedshift;
    vm.getShiftData = mConnectAPI.getAllShifts();
    vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
    var timeChart = mConnectAPI.getTimeChartData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
    if (timeChart) {
        vm.timeChartData = timeChart[vm.selectedIndex];
        machineChartData(vm.timeChartData.chartData);
    }
    else
        vm.timeChartData = {};
    vm.selectedIndexDate = index;

    if (vm.getDates[2].dateText != vm.CurrDate) {
        vm.machineStatusHide = 1;
    }
    else {

        if (vm.selectedIndexDate == 2) {
            vm.machineStatusHide = 0;
        }
        else {
            vm.machineStatusHide = 1;
        }
    }

    vm.clickDateEvent = function (dateValue, $index) {
        var dd = dateValue.split("-");
        $rootScope.currentDate = dd[2];
        if (dd[2] != vm.CurrDate) {
            vm.machineStatusHide = 1;
        }
        else {
            vm.machineStatusHide = 0;
        }
        sharedService.passData();
        mConnectAPI.selectedDate = dateValue;
        loaddata();
        vm.selectedIndexDate = $index;
    }
    function loaddata() {
        mConnectAPI.refreshData(mConnectAPI.selectedDate).then(function () {
            console.log("All data got from http", new Date());
            vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
            vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
            timeChart = mConnectAPI.getTimeChartData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
            if (timeChart) {
                vm.timeChartData = timeChart[vm.selectedIndex];
                machineChartData(vm.timeChartData.chartData);
            }
            else
                vm.timeChartData = {};
        }, function () {
            console.log("Error getting data. Putting expired item back in the cache.", new Date());
            alert("not able to get data");
        });
    }
    vm.onMachineSelectionChange = function (machineId) {
        mConnectAPI.selectedMachineId = machineId;
        vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
        timeChart = mConnectAPI.getTimeChartData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
        if (timeChart) {
            vm.timeChartData = timeChart[vm.selectedIndex];
            machineChartData(vm.timeChartData.chartData);
        }
        else
            vm.timeChartData = {};
    }
    vm.machineTimingShift = function (shiftparts, $index) {
        mConnectAPI.selectedshift = $index;
        vm.timeChartData = _.find(timeChart, { 'shiftId': Number(shiftparts) });
        machineChartData(vm.timeChartData.chartData);
        vm.selectedIndex = $index;
    }
    function machineChartData(data) {
        var chart3 = Highcharts.chart('timeChartData', {
            credits: {
                enabled: false
            },
            chart: {
                type: 'line',
                //inverted: true
            },
            title: {
                text: '',
                x: -20 //center
            },
            xAxis: {
                categories: data.categories,
                min: 0,
                title: {
                    text: ''
                }
            },
            yAxis: {
                title: {
                    text: 'Time (min)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            series: data.series
        });
    };
    $scope.timepage = function () {
        $state.go("menu.MachineTimings");
    }
    $scope.alarmPage = function () {
        $state.go("menu.alarmSummary");
    }
}])
 .controller('partCountChartCtrl', ['$state', '$scope', '$stateParams', 'mConnectAPI', 'sharedService', '$rootScope', '$filter', 'ionicDatePicker', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($state, $scope, $stateParams, mConnectAPI, sharedService, $rootScope, $filter, ionicDatePicker) {
    var vm = this;
    vm.CurrDate = new Date().getDate();
    vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);
    var tdy = new Date();
    var minDate = new Date(tdy.setDate(tdy.getDate() - 27));
    var maxDate = new Date();
    var ipObj1 = {
        callback: function (val) {
            var electedDate = new Date(val);
            debugger;
            var sdate = $filter('date')(electedDate, 'yyyy-MM-dd');
            $rootScope.selectedDATE = sdate;
            vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);
            mConnectAPI.selectedDate = vm.getDates[2].dateValue;
            var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
            vm.selectedIndexDate = index;
            if (vm.getDates[2].dateText != vm.CurrDate) {
                vm.machineStatusHide = 1;
            }
            else {
                vm.machineStatusHide = 0;
            }
            loaddata();
        },
        titleLabel: 'Select a Date',
        showTodayButton: true,
        from: minDate,
        to: maxDate,
        templateType: 'popup'
    };
    vm.passDate = function () {
        ionicDatePicker.openDatePicker(ipObj1);

    };

    var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
    vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
    if (mConnectAPI.selectedMachineId == 0)
        mConnectAPI.selectedMachineId = vm.machineData.machines[0].machineID;

    vm.selectedValue = mConnectAPI.selectedMachineId;
    vm.plantName = vm.machineData.plantName;
    vm.selectedIndex = mConnectAPI.selectedshift;
    vm.getShiftData = mConnectAPI.getAllShifts();
    vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
    var partCountChart = mConnectAPI.getPartsCountChartData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
    if (partCountChart) {
        vm.partCountChartData = partCountChart[vm.selectedIndex];
        partCountChartData(vm.partCountChartData.chartData);
    }
    else
        vm.partCountChartData = {};

    vm.selectedIndexDate = index;

    vm.hidePlant = mConnectAPI.hidePlant();

    if (vm.getDates[2].dateText != vm.CurrDate) {
        vm.machineStatusHide = 1;
    }
    else {

        if (vm.selectedIndexDate == 2) {
            vm.machineStatusHide = 0;
        }
        else {
            vm.machineStatusHide = 1;
        }
    }

    vm.clickDateEvent = function (dateValue, $index) {
        var dd = dateValue.split("-");
        $rootScope.currentDate = dd[2];
        if (dd[2] != vm.CurrDate) {
            vm.machineStatusHide = 1;
        }
        else {
            vm.machineStatusHide = 0;
        }
        sharedService.passData();
        mConnectAPI.selectedDate = dateValue;
        loaddata();
        vm.selectedIndexDate = $index;

    }
    function loaddata() {
        mConnectAPI.refreshData(mConnectAPI.selectedDate).then(function () {
            console.log("All data got from http", new Date());
            vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
            vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
            partCountChart = mConnectAPI.getPartsCountChartData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
            if (partCountChart) {
                vm.partCountChartData = partCountChart[vm.selectedIndex];
                partCountChartData(vm.partCountChartData.chartData);
            }
            else
                vm.partCountChartData = {};
        }, function () {
            console.log("Error getting data. Putting expired item back in the cache.", new Date());
            alert("not able to get data");
        });
    }
    function partCountChartData(data) {
        var chart3 = Highcharts.chart('partCountChartData', {
            credits: {
                enabled: false
            },
            chart: {
                type: 'column',
                inverted: true
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: data.categories,
                labels: {

                    style: {
                        fontSize: '10px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            legend: {
                align: 'center',
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        formatter: function () {
                            if (this.y != 0) {
                                return this.y;
                            } else {
                                return null;
                            }
                        }
                    }
                }
            },
            series: data.series
        });
    };
    vm.onMachineSelectionChange = function (machineId) {

        mConnectAPI.selectedMachineId = machineId;
        vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
        partCountChart = mConnectAPI.getPartsCountChartData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
        if (partCountChart) {
            vm.partCountChartData = partCountChart[vm.selectedIndex];
            partCountChartData(vm.partCountChartData.chartData);
        }
        else
            vm.partCountChartData = {};
    }
    vm.shiftButtonClick = function (shiftparts, $index) {
        mConnectAPI.selectedshift = $index;
        vm.partCountChartData = _.find(partCountChart, { 'shiftId': Number(shiftparts) });
        partCountChartData(vm.partCountChartData.chartData);
        vm.selectedIndex = $index;
    }
    vm.partCountnum = function () {
        $state.go("menu.partsCount");
    }
    vm.alarmPage = function () {
        $state.go("menu.alarmSummary");
    }
}])
.controller('machineConnectCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
.controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
}])
 .controller('mainController', ['$scope', '$stateParams', '$ionicHistory', '$state', 'mConnectAPI', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicHistory, $state, mConnectAPI) {
    //alert("hdddddddddddddddddd");
    var vm = this;
    $scope.programTransferPage = function () {
        $ionicHistory.goBack();
        $state.go("menu.programTransfer");
    }
    $scope.settingPage = function () {
        $ionicHistory.goBack();
        $state.go("menu.setting");
    }
    $scope.syncDataPage = function () {
        $ionicHistory.goBack();
        $state.go("menu.syncData");
    }

    if (localStorage.getItem("offlineEnabled") == null) {
        vm.Offline = true;
        //alert("In if: " + Offlineval);
    }
    else {
        vm.Offline = mConnectAPI.Offlineval;
    }


    vm.enableOffline = function () {
        mConnectAPI.Offlineval = vm.Offline;
        //localStorage.setItem('offlineEnabled', vm.Offline);
        mConnectAPI.updateWebServiceOffLine(vm.Offline).then(function (data) {
            localStorage.setItem('offlineEnabled', vm.Offline);
        });
    }

}])
 .controller('programTransferCtrl', ['$state', '$scope', '$stateParams', 'mConnectAPI', '$ionicHistory', '$timeout', '$interval', '$ionicPopup', '$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($state, $scope, $stateParams, mConnectAPI, $ionicHistory, $timeout, $interval, $ionicPopup, $rootScope) {
    var vm = this;
    var machineID = '';
    vm.PlantData = mConnectAPI.getAllPlants();
    if (vm.PlantData)
        mConnectAPI.selectedPlantId = vm.PlantData[0].plantID;
    vm.selectedPlant = mConnectAPI.selectedPlantId;
    var machineInfo = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
    if (machineInfo) {
        vm.machineData = machineInfo;
        if (machineInfo.machines.length > 0)
            vm.selectedMachine = machineInfo.machines[0].machineID;
    }
    else {
        vm.machineData = {};
        vm.selectedMachine = undefined;
    }
    vm.showSelectValue = function (value) {
        mConnectAPI.selectedPlantId = value;
        machineInfo = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
        if (machineInfo) {
            vm.machineData = machineInfo
            if (machineInfo.machines.length > 0)
                vm.selectedMachine = machineInfo.machines[0].machineID;
        }
        else {
            vm.machineData = {};
            vm.selectedMachine = undefined;
        }
    }
    $scope.alarmPage = function () {
        $state.go("menu.alarmDetails");
    }
    $scope.insert = function () {

        if (isOnline == true) {
            if (vm.selectedMachine == undefined) {
                $ionicPopup.alert({
                    title: 'Please Select Machine.',
                })
            } else {
                if (vm.selectedMachine) {
                    vm.machineInfo = _.find(vm.machineData.machines, { 'machineID': vm.selectedMachine });
                    machineID = vm.machineInfo.machineName;
                }
                vm.Num = vm.selected;
                mConnectAPI.insertProgramRequest(machineID, vm.Num);
            }
            $scope.refresh();
        }
        else {
            $ionicPopup.alert({
                title: 'Network is Offline. Please enable WiFi/Data connection. Can not process your request now.',
            })
        }
    };

    $scope.refresh = function () {
        // alert('start');
        if (vm.selectedMachine) {
            vm.machineInfo = _.find(vm.machineData.machines, { 'machineID': vm.selectedMachine });
            machineID = vm.machineInfo.machineName;
        }
        mConnectAPI.viewProgramTransferDetails(machineID).then(function (data) {
            vm.ptData = data;
        });
        $scope.timer = $timeout($scope.refresh, 2000);
    }
    $scope.refresh();
    $scope.view = function () {
        if (isOnline == true) {
            if (vm.selectedMachine == undefined) {
                $ionicPopup.alert({
                    title: 'Please Select Machine.',
                })
            } else
                $scope.refresh();
        }
        else {
            $ionicPopup.alert({
                title: 'App in Offline.Can not process your request.',
            })
        }
    }
    $scope.timer = $timeout($scope.refresh, 2000);
    $scope.$on('$locationChangeStart', function () {
        if ($scope.timer) {
            // alert('stop');
            $timeout.cancel($scope.timer);
        }
    });


    //var refresh = function () {
    //      if (vm.selectedMachine) {
    //          vm.machineInfo = _.find(vm.machineData.machines, { 'machineID': vm.selectedMachine });
    //          machineID = vm.machineInfo.machineName;
    //      }
    //      mConnectAPI.viewProgramTransferDetails(machineID).then(function (data) {
    //          vm.ptData = data;
    //      });
    //      var timer = $timeout(refresh, 2000);
    //  }
    //refresh();
    //  $scope.view = function () {
    //      refresh();
    //  }
    //  timer = $timeout(refresh, 2000);
    //  $scope.$on("$locationChangeStart", function () {
    //      if (timer) {
    //          $timeout.cancel(timer);
    //          alert("asdasdsa");
    //      }
    //  });



    $scope.programNo = ["O1", "O2", "O3", "O4", "O5", "O6", "O7", "O8", "O9", "O10"];
    vm.selected = $scope.programNo[0];
}])

.controller('settingCtrl', ['$state', '$scope', '$stateParams', 'mConnectAPI', '$ionicHistory', '$ionicPopup', '$rootScope', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($state, $scope, $stateParams, mConnectAPI, $ionicHistory, $ionicPopup, $rootScope) {
    var vm = this;
    $scope.settingPage = function () {
        $ionicHistory.goBack();
        $state.go("menu.setting");
    }
    vm.host = mConnectAPI.webApiHostAddress;
    vm.getAddress = function () {
        mConnectAPI.webApiHostAddress = vm.host;
        mConnectAPI.updateWebService(vm.host).then(function (data) {
            localStorage.setItem('webApiAddress', vm.host);
        });
        $ionicPopup.alert({
            title: 'Records saved successfully !!'
        })
    }


}])

.controller('alarmsSummaryCtrl', ['$scope', '$state', '$scope', '$stateParams', 'mConnectAPI', 'sharedService', '$rootScope', '$filter', 'ionicDatePicker', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $state, $scope, $stateParams, mConnectAPI, sharedService, $rootScope, $filter, ionicDatePicker) {
    var vm = this;
    vm.CurrDate = new Date().getDate();
    vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);
    var tdy = new Date();
    var minDate = new Date(tdy.setDate(tdy.getDate() - 27));
    var maxDate = new Date();
    var ipObj1 = {
        callback: function (val) {
            var electedDate = new Date(val);
            debugger;
            var sdate = $filter('date')(electedDate, 'yyyy-MM-dd');
            $rootScope.selectedDATE = sdate;
            vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);
            mConnectAPI.selectedDate = vm.getDates[2].dateValue;
            var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
            vm.selectedIndexDate = index;
            if (vm.getDates[2].dateText != vm.CurrDate) {
                vm.machineStatusHide = 1;
            }
            else {
                vm.machineStatusHide = 0;
            }
            loaddata();
        },
        titleLabel: 'Select a Date',
        showTodayButton: true,
        from: minDate,
        to: maxDate,
        templateType: 'popup'
    };
    vm.passDate = function () {
        ionicDatePicker.openDatePicker(ipObj1);

    };

    var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
    vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
    vm.hidePlant = mConnectAPI.hidePlant();
    if (mConnectAPI.selectedMachineId == 0)
        mConnectAPI.selectedMachineId = vm.machineData.machines[0].machineID;
    vm.selectedValue = mConnectAPI.selectedMachineId;
    vm.plantName = vm.machineData.plantName;
    vm.selectedIndexDate = index;
    vm.selectedIndex = mConnectAPI.selectedshift;
    vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
    vm.getShiftData = mConnectAPI.getAllShifts();
    var getAlarm = mConnectAPI.getAlarmsSummary(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
    if (getAlarm)
        vm.alarmsSummary = getAlarm[vm.selectedIndex];
    else
        vm.alarmsSummary = {};
    if (vm.getDates[2].dateText != vm.CurrDate) {
        vm.machineStatusHide = 1;
    }
    else {
        if (vm.selectedIndexDate == 2) {
            vm.machineStatusHide = 0;
        }
        else {
            vm.machineStatusHide = 1;
        }
    }

    vm.clickDateEvent = function (dateValue, $index) {
        var dd = dateValue.split("-");
        $rootScope.currentDate = dd[2];
        if (dd[2] != vm.CurrDate) {
            vm.machineStatusHide = 1;
        }
        else {
            vm.machineStatusHide = 0;
        }
        sharedService.passData();
        mConnectAPI.selectedDate = dateValue;
        loaddata();
        vm.selectedIndexDate = $index;
    }
    function loaddata() {
        mConnectAPI.refreshData(mConnectAPI.selectedDate).then(function () {
            console.log("All data got from http", new Date());
            vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
            vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
            getAlarm = mConnectAPI.getAlarmsSummary(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
            if (getAlarm)
                vm.alarmsSummary = getAlarm[vm.selectedIndex];
            else
                vm.alarmsSummary = {};
        }, function () {
            console.log("Error getting data. Putting expired item back in the cache.", new Date());
            alert("not able to get data");
        });
    }
    vm.onMachineSelectionChange = function (machineId) {
        vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
        mConnectAPI.selectedMachineId = machineId;
        getAlarm = mConnectAPI.getAlarmsSummary(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
        if (getAlarm)
            vm.alarmsSummary = getAlarm[vm.selectedIndex];
        else
            vm.alarmsSummary = {};
    }
    vm.shiftButtonClick = function (shiftparts, $index) {
        mConnectAPI.selectedshift = $index;
        vm.alarmsSummary = _.find(getAlarm, { 'shiftId': Number(shiftparts) });
        vm.selectedIndex = $index;
    }
    $scope.mTchart = function () {
        $state.go("menu.alarmDetails");
    }

}])

.controller('syncDataCtrl', ['$scope', '$stateParams', '$filter', 'mConnectAPI', '$ionicPopup', '$ionicLoading',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $filter, mConnectAPI, $ionicPopup, $ionicLoading) {
    var vm = this;
    vm.fromDate = {};
    vm.toDate = {};
    //vm.fromDate = $filter('date')(new Date(), 'yyyy-MM-dd');
    //vm.toDate = $filter('date')(new Date(), 'yyyy-MM-dd');

    vm.fromDate = new Date();
    vm.toDate = new Date();
    var today = new Date();

    vm.maxDate = $filter('date')(today, 'yyyy-MM-dd');
    var tdy = new Date();
    var minDate1 = new Date(tdy.setDate(tdy.getDate() - 30));
    vm.minDate = $filter('date')(minDate1, 'yyyy-MM-dd');


    $scope.sycResult = false;
    var syncSuccess = [];
    var syncFailure = [];
    var flagFirst = 0;//to overcome first time date undefined error

    vm.sync = function () {
        debugger;
        var startDate = {}, endDate = {};
        if (isOnline == true) {
            
            if (flagFirst==0)
            {
                flagFirst = 1;
                vm.sync();
            }

            startDate = vm.fromDate;
            endDate = vm.toDate;

            //alert(vm.fromDate + "ttt" + vm.toDate);
            if (startDate > endDate) {
                $ionicPopup.alert({
                    title: 'From Date should be less than To Date',

                })
            }
            else {

                $ionicLoading.show({ template: '<p>Syncing.......</p><ion-spinner class="spinner-positive" icon="lines"></ion-spinner>', duration: 2000 });
                while (startDate <= endDate) {
                    debugger;
                    fdt = $filter('date')(startDate, 'yyyy-MM-dd');
                    mConnectAPI.syncdata(fdt).then(function (msg) {
                        syncSuccess.push(msg);
                    }, function (msg) {

                        syncFailure.push(msg);

                    });

                    startDate = new Date(startDate.setDate(startDate.getDate() + 1));
                }

                $scope.syncSucc = syncSuccess;
                $scope.synFail = syncFailure;
                syncSuccess = [];
                syncFailure = [];

                vm.fromDate = new Date();
                vm.toDate = new Date();
                var userDetails = (deviceNameFull + "-" + macaddress);

                mConnectAPI.insertUserDetails(userDetails);
            }
        }
        else {
            $ionicPopup.alert({
                title: 'Network is Offline. Please enable WiFi/Data connection. Can not process your request now.',
            })
        }
    }

}])

.controller('statisticsCtrl', ['$scope', '$stateParams', '$filter', 'mConnectAPI', '$ionicPopup', '$ionicLoading', '$rootScope', '$state', '$filter', 'sharedService', 'ionicDatePicker',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $filter, mConnectAPI, $ionicPopup, $ionicLoading, $rootScope, $state, $filter, sharedService, ionicDatePicker) {
    var vm = this;
    debugger;
    vm.CurrDate = new Date().getDate();
    vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);
    var tdy = new Date();
    var minDate = new Date(tdy.setDate(tdy.getDate() - 27));
    var maxDate = new Date();
    var ipObj1 = {
        callback: function (val) {
            var electedDate = new Date(val);
            debugger;
            var sdate = $filter('date')(electedDate, 'yyyy-MM-dd');
            $rootScope.selectedDATE = sdate;
            vm.getDates = mConnectAPI.getDates($rootScope.selectedDATE);
            mConnectAPI.selectedDate = vm.getDates[2].dateValue;
            var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
            vm.selectedIndexDate = index;
            if (vm.getDates[2].dateText != vm.CurrDate) {
                vm.machineStatusHide = 1;
            }
            else {
                vm.machineStatusHide = 0;
            }

            loaddata();
        },
        titleLabel: 'Select a Date',
        showTodayButton: true,
        from: minDate,
        to: maxDate,
        templateType: 'popup'
    };
    vm.passDate = function () {
        ionicDatePicker.openDatePicker(ipObj1);

    };

    var index = _.findIndex(vm.getDates, { 'dateValue': mConnectAPI.selectedDate });
    vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
    if (mConnectAPI.selectedMachineId == 0)
        mConnectAPI.selectedMachineId = vm.machineData.machines[0].machineID;
    vm.selectedValue = mConnectAPI.selectedMachineId;
    vm.plantName = vm.machineData.plantName;
    vm.getShiftData = mConnectAPI.getAllShifts();
    vm.selectedIndexDate = index;
    vm.selectedIndex = mConnectAPI.selectedshift;
    vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
    vm.hidePlant = mConnectAPI.hidePlant();

    var statData = mConnectAPI.getStatisticsData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
    if (statData)
        vm.statistics = statData[vm.selectedIndex];
        // vm.statistics = statData[1];
    else
        vm.statistics = {};

    if (vm.getDates[2].dateText != vm.CurrDate) {
        vm.machineStatusHide = 1;
    }
    else {
        if (vm.selectedIndexDate == 2) {
            vm.machineStatusHide = 0;
        }
        else {
            vm.machineStatusHide = 1;
        }
    }

    vm.clickDateEvent = function (dateValue, $index) {
        var dd = dateValue.split("-");
        $rootScope.currentDate = dd[2];
        if (dd[2] != vm.CurrDate) {
            vm.machineStatusHide = 1;
        }
        else {
            vm.machineStatusHide = 0;
        }
        sharedService.passData();
        mConnectAPI.selectedDate = dateValue;
        loaddata();
        vm.selectedIndexDate = $index;
    }
    function loaddata() {
        mConnectAPI.refreshData(mConnectAPI.selectedDate).then(function () {
            console.log("All data got from http", new Date());
            vm.machineData = mConnectAPI.getMachinesForPlant(mConnectAPI.selectedPlantId);
            vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
            var statData = mConnectAPI.getStatisticsData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
            if (statData)
                vm.statistics = statData[vm.selectedIndex];
                // vm.statistics = statData[1];
            else
                vm.statistics = {};
        }, function () {
            console.log("Error getting data. Putting expired item back in the cache.", new Date());
            alert("not able to get data");
        });
    }

    vm.partcntpage = function () {
        $state.go("menu.partsCount");
    }

    vm.statisticShift = function (shiftparts, $index) {
        debugger;
        mConnectAPI.selectedshift = $index;
        vm.statistics = _.find(statData, { 'shiftId': Number(shiftparts) });
        vm.selectedIndex = $index;
    }

    vm.onMachineSelectionChange = function (machineId) {
        mConnectAPI.selectedMachineId = machineId;
        vm.machineStatus = _.find(vm.machineData.machines, { 'machineID': mConnectAPI.selectedMachineId })
        var statData = mConnectAPI.getStatisticsData(mConnectAPI.selectedDate, mConnectAPI.selectedPlantId, mConnectAPI.selectedMachineId);
        if (statData)
            vm.statistics = statData[vm.selectedIndex];
            // vm.statistics = statData[1];
        else
            vm.statistics = {};
    }

    $scope.alarmPage = function () {
        $state.go("menu.alarmSummary");
    }


}])