import { DatasetServiceClient } from '@google-cloud/aiplatform'
import { Storage } from '@google-cloud/storage'

import type { Bucket } from '@google-cloud/storage'

const {
  GOOGLECLOUD_BUCKET,
  GOOGLECLOUD_CLIENT_EMAIL,
  GOOGLECLOUD_CLIENT_PRIVATE_KEY,
  GOOGLECLOUD_LOCATION,
  GOOGLECLOUD_PROJECT_ID,
} = process.env

class GoogleCloud {
  public bucket: Bucket
  public datasetServiceClient: DatasetServiceClient
  public location: string

  private storage: Storage

  constructor() {
    if (GOOGLECLOUD_BUCKET === undefined) {
      throw new Error('`GOOGLECLOUD_BUCKET` environment variable is undefined.')
    }
    if (GOOGLECLOUD_CLIENT_EMAIL === undefined) {
      throw new Error('`GOOGLECLOUD_CLIENT_EMAIL` environment variable is undefined.')
    }
    if (GOOGLECLOUD_CLIENT_PRIVATE_KEY === undefined) {
      throw new Error('`GOOGLECLOUD_CLIENT_PRIVATE_KEY` environment variable is undefined.')
    }
    if (GOOGLECLOUD_LOCATION === undefined) {
      throw new Error('`GOOGLECLOUD_LOCATION` environment variable is undefined.')
    }
    if (GOOGLECLOUD_PROJECT_ID === undefined) {
      throw new Error('`GOOGLECLOUD_PROJECT_ID` environment variable is undefined.')
    }

    this.location = GOOGLECLOUD_LOCATION

    const options = {
      credentials: {
        client_email: GOOGLECLOUD_CLIENT_EMAIL,
        private_key: GOOGLECLOUD_CLIENT_PRIVATE_KEY,
      },
      projectId: GOOGLECLOUD_PROJECT_ID,
    }

    this.datasetServiceClient = new DatasetServiceClient(options)

    this.storage = new Storage(options)
    this.bucket = this.storage.bucket(GOOGLECLOUD_BUCKET)
  }
}

export const googleCloud = new GoogleCloud()
