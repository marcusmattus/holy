#!/usr/bin/env node
import { Command } from 'commander'
import prompts from 'prompts'
import pc from 'picocolors'

const program = new Command()

program
  .name('create-holy-app')
  .description('Create a new Holy-powered web app')
  .version('0.1.0')
  .argument('[project-name]', 'Name of the project')
  .action(async (projectName?: string) => {
    console.log(pc.bold(pc.magenta('\n✦ Holy — Create Your App\n')))
    console.log(pc.dim('Powered by HolyOS from Holystic Labs\n'))

    const responses = await prompts([
      {
        type: projectName ? null : 'text',
        name: 'name',
        message: 'What is your project name?',
        initial: 'my-holy-app',
      },
      {
        type: 'select',
        name: 'template',
        message: 'Select a template',
        choices: [
          {
            title: 'Holy Dashboard',
            value: 'dashboard',
            description: 'Full dashboard app with analytics',
          },
          {
            title: 'Holy Landing',
            value: 'landing',
            description: 'Marketing landing page',
          },
          {
            title: 'Holy Store',
            value: 'store',
            description: 'Web App Store listing',
          },
          {
            title: 'Holy Minimal',
            value: 'minimal',
            description: 'Minimal Next.js starter',
          },
        ],
      },
      {
        type: 'confirm',
        name: 'useHolyOS',
        message: 'Enable HolyOS SDK?',
        initial: true,
      },
    ])

    const name = projectName ?? responses.name ?? 'my-holy-app'
    const template = responses.template ?? 'minimal'

    console.log(
      pc.green(
        `\n✓ Creating ${pc.bold(name)} with template ${pc.bold(template)}\n`,
      ),
    )
    console.log(pc.dim('  Next steps:'))
    console.log(pc.dim(`  1. cd ${name}`))
    console.log(pc.dim('  2. pnpm install'))
    console.log(pc.dim('  3. pnpm dev\n'))
    console.log(pc.bold(pc.magenta('  Built with Holy ✦\n')))
  })

program.parse()
