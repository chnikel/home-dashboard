import ServiceRepository from "./ServiceRepository";
import TagRepository from "./TagRepository";

const repositories = {
  services: ServiceRepository,
  tags: TagRepository,
};

const Repository = {
  get: (name: keyof typeof repositories) => repositories[name],
};

export default Repository;
