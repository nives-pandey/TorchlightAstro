/**
 * Torchlight — Metro configuration
 *
 * Copyright (c) 2026 Nives Pandey. All rights reserved.
 * Author: Nives Pandey, Founder & CEO, EagleCortex.
 */

const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const workspaceRoot = path.resolve(__dirname, '../..');

/**
 * Metro defaults to watching only the app directory, which is correct for a
 * standalone app but wrong here: npm hoists shared packages to the workspace
 * root, so most of what the app imports lives outside the folder Metro is
 * looking at. It reports these as unresolvable even though the files are there.
 *
 * Two settings fix it, and both are needed:
 *
 *   `watchFolders` puts the workspace root inside Metro's view at all, so files
 *   above the app can be read and watched for changes.
 *
 *   `nodeModulesPaths` tells the resolver where to look, in order — the app's
 *   own node_modules first, so a package deliberately kept local (npm keeps one
 *   there when its version conflicts with another workspace's) still wins over
 *   the hoisted copy.
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [workspaceRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
