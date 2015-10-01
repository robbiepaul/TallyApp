angular.module('tally.config', [])
    .constant('DB_CONFIG', {
        name: 'TALLY',
        tables: [
            {
                name: 'documents',
                columns: [
                    {name: 'id', type: 'integer primary key'},
                    {name: 'created_at', type: 'text'},
                    {name: 'document_title', type: 'text'},
                    {name: 'total', type: 'text'},
                    {name: 'items', type: 'text'}
                ]
            }
        ]
    })
    .constant('DEFAULT_SETTINGS', {
        language:'English'
    })
    .constant('APP_CONFIG', {
        baseUrl:'http://robbiepaul.co/tallyroll'// 'http://192.168.22.11' //
    });
