import { Command, Option } from 'commander';
import Conf from 'conf';
import consola from 'consola';
import { join } from 'node:path';
import { z } from 'zod';

const config = new Conf({
  cwd: join(process.cwd(), '.bigcommerce'),
  projectSuffix: '',
  configName: 'project',
});

async function fetchProjects(apiHost: string, storeHash: string, accessToken: string) {
  const response = await fetch(`https://${apiHost}/stores/${storeHash}/v3/headless/projects`, {
    headers: {
      'X-Auth-Token': accessToken,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`);
  }

  const json: unknown = await response.json();

  const schema = z.object({
    data: z.array(
      z.object({
        uuid: z.string(),
        name: z.string(),
      }),
    ),
  });

  return schema.parse(json);
}

export const link = new Command('link')
  .description('Link your local Catalyst repository to a BigCommerce project')
  .addOption(
    new Option(
      '--store-hash <hash>',
      'BigCommerce store hash. Can be found in the URL of your store Control Panel.',
    ).env('BIGCOMMERCE_STORE_HASH'),
  )
  .addOption(
    new Option(
      '--access-token <token>',
      'BigCommerce access token. Can be found after creating a store-level API account.',
    ).env('BIGCOMMERCE_ACCESS_TOKEN'),
  )
  .addOption(
    new Option('--api-host <host>', 'BigCommerce API host. The default is api.bigcommerce.com.')
      .env('BIGCOMMERCE_API_HOST')
      .default('api.bigcommerce.com'),
  )
  .addOption(
    new Option(
      '--project-id <id>',
      'BigCommerce headless project ID. Can be found via the BigCommerce API (GET /v3/headless/projects).',
    ).env('BIGCOMMERCE_PROJECT_ID'),
  )
  .action(async (options) => {
    try {
      if (options.projectId) {
        consola.start('Project ID provided, writing to .bigcommerce/project.json...');
        config.set('projectId', options.projectId);
        consola.success('Project ID written to .bigcommerce/project.json');
        process.exit(0);
      }

      if (options.storeHash && options.accessToken) {
        consola.start('Fetching projects...');

        const projects = await fetchProjects(
          options.apiHost,
          options.storeHash,
          options.accessToken,
        );

        consola.success('Projects fetched');

        const projectUuid = await consola.prompt('Select a project (Press <enter> to select)', {
          type: 'select',
          options: projects.data.map((project) => ({
            label: project.name,
            value: project.uuid,
            hint: project.uuid,
          })),
          cancel: 'reject',
        });

        consola.start('Writing project ID to .bigcommerce/project.json...');
        config.set('projectId', projectUuid);
        consola.success('Project ID written to .bigcommerce/project.json');
        process.exit(0);
      }

      consola.error('No project ID provided');
      consola.info('Please provide a project ID using the --project-id flag');
      consola.info(
        'Or provide a store hash and access token using the --store-hash and --access-token flags',
      );
    } catch (error) {
      consola.error(error);
      process.exit(1);
    }
  });
