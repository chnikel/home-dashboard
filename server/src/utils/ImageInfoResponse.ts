export interface ImageInfoResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Result[];
}

export interface Result {
  creator: number;
  id: number;
  images: Image[];
  last_updated: Date;
  last_updater: number;
  last_updater_username: string;
  name: string;
  repository: number;
  full_size: number;
  v2: boolean;
  tag_status: string;
  tag_last_pulled: Date;
  tag_last_pushed: Date;
  media_type: string;
  content_type: string;
  digest: string;
}

export interface Image {
  architecture: string;
  features: string;
  variant: null;
  digest: string;
  os: string;
  os_features: string;
  os_version: null;
  size: number;
  status: string;
  last_pulled: Date;
  last_pushed: Date;
}
