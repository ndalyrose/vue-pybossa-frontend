#!/usr/bin/env bash

SETTINGS="https://github.com/LibCrowds/libcrowds-frontend-settings"

# Configure site
rm src/siteConfig.js
rm -rf src/custom/*/
git clone $SETTINGS src/custom/settings
echo "module.exports = require('@/custom/settings/siteConfig.js')" >> src/siteConfig.js
