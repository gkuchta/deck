'use strict';

import {TITUS_MIGRATION_CONFIG_COMPONENT} from './migration/titusMigrationConfig.component';

let angular = require('angular');

require('./logo/titus.logo.less');

// load all templates into the $templateCache
var templates = require.context('./', true, /\.html$/);
templates.keys().forEach(function(key) {
  templates(key);
});

module.exports = angular.module('spinnaker.titus', [
  require('core/cloudProvider/cloudProvider.registry.js'),
  require('./securityGroup/securityGroup.read.service'),
  require('./serverGroup/details/serverGroupDetails.titus.controller.js'),
  require('./serverGroup/configure/ServerGroupCommandBuilder.js'),
  require('./serverGroup/configure/wizard/CloneServerGroup.titus.controller.js'),
  require('./serverGroup/configure/serverGroup.configure.titus.module.js'),
  require('./serverGroup/serverGroup.transformer.js'),
  require('./instance/details/instance.details.controller.js'),
  require('./validation/applicationName.validator.js'),
  require('./pipeline/stages/findAmi/titusFindAmiStage.js'),
  require('./pipeline/stages/runJob/titusRunJobStage.js'),
  TITUS_MIGRATION_CONFIG_COMPONENT,
])
  .config(function(cloudProviderRegistryProvider) {
    cloudProviderRegistryProvider.registerProvider('titus', {
      name: 'Titus',
      logo: {
        path: require('./logo/titus.logo.png')
      },
      serverGroup: {
        transformer: 'titusServerGroupTransformer',
        detailsTemplateUrl: require('./serverGroup/details/serverGroupDetails.html'),
        detailsController: 'titusServerGroupDetailsCtrl',
        cloneServerGroupTemplateUrl: require('./serverGroup/configure/wizard/serverGroupWizard.html'),
        cloneServerGroupController: 'titusCloneServerGroupCtrl',
        commandBuilder: 'titusServerGroupCommandBuilder',
        configurationService: 'titusServerGroupConfigurationService',
        skipUpstreamStageCheck: true,
      },
      securityGroup: {
        reader: 'titusSecurityGroupReader',
        useProvider: 'aws'
      },
      instance: {
        detailsTemplateUrl: require('./instance/details/instanceDetails.html'),
        detailsController: 'titusInstanceDetailsCtrl'
      }
    });
  });
