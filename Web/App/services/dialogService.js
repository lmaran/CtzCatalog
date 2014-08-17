// http://plnkr.co/edit/KnRMGw5Avz2MW3TnzuVT?p=preview
/*  usage

    $dialog.confirm(<message>, <description>, <title>, <yes>, <no>).then(function() {
        // put your main action here
    });

     or

    $dialog.confirm(<message>, <description>, <title>, <yes>, <no>).then(function () {
        // put your main action here
    }, function () {
        // rejected
    });
*/
app.service('dialogService', function ($modal, $rootScope, $q) {

    function createScope(title, message, details) {
        var deferred = $q.defer();
        var scope = $rootScope.$new(true);

        scope.ok = function (value) {
            deferred.resolve(value);
            this.$hide();
        };

        scope.cancel = function () {
            deferred.reject();
            this.$hide();
        };

        scope.title = title;
        scope.message = message || '';
        scope.details = details || '';
        scope.promise = deferred.promise;

        return scope;
    }

    function confirm(message, details, title, yes, no) {
        var scope = createScope(title || 'Confirm', message || 'Are you sure?', details);

        scope.yes = yes || 'Yes';
        scope.no = no || 'No';

        $modal({ template: 'App/views/dialog.confirm.html', scope: scope, show: true });

        return scope.promise;
    }

    function alert(message, details, title, close) {
        var scope = createScope(title || 'Alert', message, details);

        scope.close = close || 'Close';

        $modal({ template: 'App/views/dialog.alert.html', scope: scope, show: true });

        return scope.promise;
    }

    return {
        confirm: confirm,
        alert: alert
    };
})