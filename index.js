module.exports = async function (data) {

    // Lodash Module
    const _ = require('lodash');

    const tinyCfg = _.defaultsDeep({}, data.config, {
        timeout: 10,
        pages: 1,
        query: '*',
        filter_id: 56027,
        per_page: 100
    });

    // Create Settings
    const booru_settings = _.defaultsDeep({}, data.module, {
        
        // ID
        id: 'derpibooru',
        
        // DB
        db: {
            type: 'ref',
            data: null
        },

        // Byte Limit
        byteLimit: {

            // JSON
            json: {

                // Tag
                tag: 1048576,

                // Error
                error: 1048576

            }

        }
    });

    // Main Config
    const mainConfig = {
        name: 'Derpibooru',
        url: 'https://derpibooru.org',
        module_name: 'derpibooru_http_api_v1',
        tagListVar: 'tags',
        idVar: 'id',
    };

    // Config Fusion
    for (const item in mainConfig) {
        booru_settings[item] = mainConfig[item];
    }

    // Booru
    const booruDatabase = require('@tinypudding/firebase-booru-database');

    // Derpibooru
    const derpibooru = new booruDatabase(booru_settings);

    // Prepare Module
    const items_to_use = {};

    // Run Code
    items_to_use.run = function () {
        return new Promise(async function (resolve, reject) {

            // Try Get
            try {

                // Get Errors
                const errorResult = await derpibooru.checkError();

                // Check Timeout
                if (!errorResult.error) {

                    // Fetch
                    const fetch = require('node-fetch');

                    // Response
                    const response = await fetch(`${mainConfig.url}/api/v1/json/search/images?q=*&filter_id=56027&page=1&per_page=100`);

                    // Search Items
                    const result = await response.json();

                    // Exist Data
                    if (Array.isArray(result.images) && result.images.length > 0 && typeof result.total === "number" && result.total > 0) {
                        await derpibooru.getDBItem('itemTotal').set(result.total)
                        errorResult.data = await derpibooru.updateDatabase(result.images);
                    }

                }

                // Nope
                else {
                    errorResult.data.timeout--;
                    await derpibooru.setErrorTimeout(errorResult.data.timeout);
                }

                // Send Result
                resolve(errorResult);

            }

            // Error
            catch (err) {

                // Send Error
                try {
                    await derpibooru.error({ message: err.message, timeout: tinyCfg.timeout });
                    reject(err);
                }

                // Error Again
                catch (err2) {
                    reject(err2);
                }

            }

            // Complete
            return;

        });
    };

    // Get Object
    items_to_use.getRoot = function () {
        return derpibooru;
    };

    // Complete
    return items_to_use;

};