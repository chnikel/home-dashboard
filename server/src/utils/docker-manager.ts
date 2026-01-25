import { ImageInfoResponse } from './ImageInfoResponse';
import util from 'util';
import { exec } from 'child_process';


type Container = {
  State: 'running' | 'stopped';
  Labels: Record<string, string>;
  Image: string;
};

type ContainerWithStatus = {
  name: string;
  status: 'running' | 'stopped';
  containers: Container[];
};

const execAsync = util.promisify(exec);

const customImages = {
  '0c03664af9ed': {
    image: 'portainer/portainer-ce',
  },
};

type CustomImages = keyof typeof customImages | string;

export class DockerManager {
  /**
   * Converts the labels string into a js object.
   *
   * @param {*} container
   *
   * @returns
   */
  _parseLabels(container: { Labels: string }) {
    return container.Labels.split(',').reduce<Record<string, string>>(
      (acc, line) => {
        // Convert label "key=value" into object
        const [key, value] = line.split('=');
        acc[key] = value;
        return acc;
      },
      {},
    );
  }

  /**
   * @returns All active and inactive containers.
   */
  async getAllContainers(): Promise<Container[]> {
    const { stdout } = await execAsync('docker ps --format "{{json .}}" --all');
    const lines = stdout.trim().split('\n');
    const containers = lines.map((line) => {
      const container = JSON.parse(line);
      container.Labels = this._parseLabels(container);
      return container;
    });

    return containers;
  }

  /**
   * @param {*} container
   *
   * @returns `true` if the container is in the state "running".
   */
  isRunning(container: Container) {
    return container.State === 'running';
  }

  withStackStatus(stacks: Record<string, Container[]>) {
    return Object.entries(stacks).map(
      ([name, containers]) =>
        ({
          name,
          status: containers.every(this.isRunning) ? 'running' : 'stopped',
          containers,
        } satisfies ContainerWithStatus),
    );
  }

  async getStacks() {
    const containers = await this.getAllContainers();

    const groupByStackName = (
      acc: Record<string, Container[]>,
      container: Container,
    ) => {
      const stackName = container.Labels['com.docker.compose.project'] || '';
      (acc[stackName] ??= []).push(container);
      return acc;
    };

    const stacks = containers.reduce(groupByStackName, {});

    return this.withStackStatus(stacks);
  }

  async getImageHash(image: string) {
    const { stdout } = await execAsync(
      `docker inspect ${image} --format '{{.RepoDigests}}'`,
    );

    return stdout
      .trim()
      // .replaceAll('[', '')
      // .replaceAll(']', '')
      // .replaceAll("'", '')
      .split('@')[1];
  }

  async getStacksWithUpdateInfo() {
    const stacks = await this.getStacks();

    const stacksWithNeedUpdate = await Promise.all(
      stacks.map(async (stack) => {
        const containers = await Promise.all(
          stack.containers.map(async (container) => {
            const image = container.Image;
            const imageInfo = await dockerManager.imageInfo(image);

            return {
              ...container,
              ...imageInfo,
            };
          }),
        );

        return {
          ...stack,
          needUpdate: containers.some((c) => !c.isLatestVersion),
          containers,
        };
      }),
    );

    return stacksWithNeedUpdate;
  }

  autofillLibrary(image: string) {
    const parts = image.split('/');
    if (parts.length < 2) {
      return ['library', ...parts].join('/');
    }

    return image;
  }

  async findImage(image: string) {
    const url = `https://hub.docker.com/v2/repositories/${this.autofillLibrary(
      image,
    )}/tags?page_size=10`;
    const response = await fetch(url);
    const data = (await response.json()) as ImageInfoResponse;

    return data.results;
  }

  async imageInfo(image: string) {
    const overwrittenImage = (customImages as any)[image]?.image || image;

    const images = await this.findImage(overwrittenImage.replace(/:.+/, '')); // remove the tag from the image
    const currentImageHash = await this.getImageHash(image);

    if (!images) {
      return {
        currentImageHash,
        latestImageHash: null,
        isLatestVersion: true,
        foundImage: null,
      };
    }

    const foundImage = images.find((r) => r.name === 'latest');
    const latestImageHash = foundImage?.digest;

    return {
      foundImage,
      latestImageHash,
      currentImageHash,
      isLatestVersion: latestImageHash === currentImageHash,
    };
  }
}

export const dockerManager = new DockerManager();
