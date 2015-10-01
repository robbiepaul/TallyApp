var services = angular.module('tally.services', ['tally.config']);


services.factory('DB', function($q, DB_CONFIG, $rootScope) {
        var self = this;
        self.db = null;

        self.init = function(callback) {

            if ( ionic.Platform.isIOS() ) {
                self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name});
            } else {
                self.db = window.openDatabase(DB_CONFIG.name, '1.0', DB_CONFIG.name, 1000000);
            }
            //
            //

            angular.forEach(DB_CONFIG.tables, function(table) {
                var columns = [];
                angular.forEach(table.columns, function(column) {
                    columns.push(column.name + ' ' + column.type);
                });
                var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
                self.query(query);
                console.log('Table ' + table.name + ' initialized ['+query+']');

            });
            $rootScope.$emit('initialized');
            if(typeof callback == 'function') callback();
        };

        self.query = function(query, bindings) {
            bindings = typeof bindings !== 'undefined' ? bindings : [];
            var deferred = $q.defer();

            self.db.transaction(function(transaction) {
                transaction.executeSql(query, bindings, function(transaction, result) {
                    deferred.resolve(result);
                }, function(transaction, error) {
                    deferred.reject(error);
                });
            });

            return deferred.promise;
        };

        self.fetchAll = function(result) {
            var output = [];

            for (var i = 0; i < result.rows.length; i++) {
                output.push(result.rows.item(i));
            }

            return output;
        };

        self.fetch = function(result) {
            return result.rows.item(0);
        };

        return self;
    })

    .factory('Documents', function(DB, DB_CONFIG, $q, $http, APP_CONFIG) {
        var self = this;
        var table = 'documents';

        self.all = function() {
            return DB.query('SELECT * FROM '+table)
                .then(function(result){
                    return DB.fetchAll(result);
                });
        };

        self.getById = function(id) {
            return DB.query('SELECT * FROM '+table+' WHERE id = ?', [id])
                .then(function(result){
                    return DB.fetch(result);
                });
        };

        self.removeById = function(id) {
            return DB.query('DELETE FROM '+table+' WHERE id = ?', [id])
                .then(function(result){

                    return true;
                });
        };

        self.create = function(data) {
            var fields = DB_CONFIG.tables[0].columns;
            angular.forEach(fields, function(field) {
                if(data[field.name] == undefined) data[field.name] = '';
            });
            if(!data.created_at) {
                data.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
            }

            delete data.id;
            return DB.query('INSERT INTO '+table+' (created_at, document_title, total, items) VALUES (?,?,?,?)', [data.created_at,data.document_title,data.total,data.items])
                .then(function(result){
                    return result.insertId;
                },function(err){

                    return err;
                })
        };

        return self;
    });
