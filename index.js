module.exports = function (data) {

    // Exist Data
    if (data) {

        // Prepare Generator
        const philomena_generator = require('@tinypudding/firebase-philomena-database');

        // Send the Derpibooru Module
        return philomena_generator({

            // Derpibooru Settings
            booru: {
                version: 1,
                id: 'derpibooru',
                name: 'Derpibooru',
                url: 'https://derpibooru.org',
                tagListVar: 'tags',
                idVar: 'id',
            },

            // Config
            config: data.config,

            // Module
            module: data.module

        });

    }

    // Nope
    else { throw new Error('The data value is empty!'); }

};