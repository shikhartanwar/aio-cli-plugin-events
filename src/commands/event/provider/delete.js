/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const BaseCommand = require('../../../BaseCommand.js')
const { CliUx: { ux: cli } } = require('@oclif/core')
const inquirer = require('inquirer')
const aioLogger = require('@adobe/aio-lib-core-logging')('@adobe/aio-cli-plugin-events:provider:delete', { provider: 'debug' })

class ProviderDeleteCommand extends BaseCommand {
  async run () {
    const { args } = await this.parse(ProviderDeleteCommand)

    try {
      await this.initSdk()
      const response = await inquirer.prompt([{
        type: 'confirm',
        name: 'delete',
        message: 'Are you sure you want to delete the provider? This operation is irreversible.'

      }])
      if (response.delete) {
        cli.action.start('Deleting Event Provider')
        await this.eventClient.deleteProvider(this.conf.org.id,
          this.conf.project.id, this.conf.workspace.id, args.providerId)
        cli.action.stop()
        this.log('Provider ' + args.providerId +
                ' has been deleted successfully')
      } else {
        this.log('Delete operation has been cancelled')
      }
    } catch (err) {
      aioLogger.debug(err)
      this.error(err)
    }
  }
}

ProviderDeleteCommand.description = 'Delete Provider by id'

ProviderDeleteCommand.args = [
  { name: 'providerId', required: true, description: 'The requested provider ID' }
]

ProviderDeleteCommand.flags = {
  ...BaseCommand.flags
}

module.exports = ProviderDeleteCommand
