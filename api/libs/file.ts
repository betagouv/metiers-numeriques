import AwsSdkS3 from 'aws-sdk/clients/s3'
import download from 'download'

import { FILE_TYPE } from '../../common/constants'
import { handleError } from '../../common/helpers/handleError'

import type { FileTypeKey, FileTypeValue } from '../../common/constants'

const { AWS_S3_BUCKET } = process.env

// eslint-disable-next-line @typescript-eslint/naming-convention
const __AWS_SDK_S3 = {
  awsSdkS3Instance: new AwsSdkS3(),
}

class File {
  private s3BucketName: string
  private s3Instance: AwsSdkS3

  constructor() {
    try {
      if (AWS_S3_BUCKET === undefined) {
        throw new Error('`AWS_S3_BUCKET` environment variable is undefined.')
      }

      this.s3BucketName = AWS_S3_BUCKET
      this.s3Instance = __AWS_SDK_S3.awsSdkS3Instance
    } catch (err) {
      handleError(err, 'api/libs/File.constructor()', true)
    }
  }

  public async delete(id: string, extension: string): Promise<void> {
    try {
      const params: AwsSdkS3.DeleteObjectRequest = {
        Bucket: this.s3BucketName,
        Key: `${id}.${extension}`,
      }

      await new Promise((resolve, reject) => {
        this.s3Instance.deleteObject(params, err => {
          if (err !== null) {
            reject(err)

            return
          }

          resolve(undefined)
        })
      })
    } catch (err) {
      handleError(err, 'api/libs/File.download()')
    }
  }

  public async download(url: string): Promise<
    | {
        body?: Buffer
        type: FileTypeValue
      }
    | undefined
  > {
    try {
      const type = this.getFileTypeFromUrl(url)
      if (type === undefined) {
        return
      }
      // If this file is just an external link (i.e.: website URL, Youtube URL, etc)
      if (type.ext === '') {
        return {
          type,
        }
      }

      const body = await download(url)

      return {
        body,
        type,
      }
    } catch (err) {
      handleError(err, 'api/libs/File.download()')
    }
  }

  public async transfer(
    id: string,
    url: string,
  ): Promise<
    | {
        type: FileTypeKey
        url: string
      }
    | undefined
  > {
    try {
      const result = await this.download(url)
      if (result === undefined) {
        return
      }

      const { body, type } = result
      if (body === undefined) {
        return {
          type: 'EXTERNAL',
          url,
        }
      }

      const newUrl = await this.upload(id, type, body)
      if (newUrl === undefined) {
        throw new Error('`newUrl` is undefined.')
      }

      return {
        type: type.ext.toUpperCase() as FileTypeKey,
        url: newUrl,
      }
    } catch (err) {
      handleError(err, 'api/libs/File.transfer()')
    }
  }

  public async upload(id: string, type: FileTypeValue, body: AwsSdkS3.Body): Promise<string | undefined> {
    try {
      const params: AwsSdkS3.PutObjectRequest = {
        Body: body,
        Bucket: this.s3BucketName,
        ContentLanguage: 'fr-FR',
        ContentType: type.mime,
        GrantRead: 'uri=http://acs.amazonaws.com/groups/global/AllUsers',
        Key: `${id}.${type.ext}`,
      }

      return await new Promise((resolve, reject) => {
        this.s3Instance.upload(params, (err, data) => {
          if (err !== null) {
            reject(err)

            return
          }

          resolve(data.Location)
        })
      })
    } catch (err) {
      handleError(err, 'api/libs/File.upload()')
    }
  }

  private getFileTypeFromUrl(url: string): FileTypeValue | undefined {
    try {
      const regexpResult = /\.([a-z]+)(#|\?|$)/i.exec(url)
      if (regexpResult === null) {
        return FILE_TYPE.EXTERNAL
      }

      const extensionKey = regexpResult[1].toUpperCase()
      if (['HTML'].includes(extensionKey)) {
        return FILE_TYPE.EXTERNAL
      }

      const fileType = FILE_TYPE[extensionKey]
      if (fileType === undefined) {
        throw new Error(`Cannot handle "${extensionKey}" file type.`)
      }

      return FILE_TYPE[extensionKey]
    } catch (err) {
      handleError(err, 'api/libs/File.getFileTypeFromUrl()')
    }
  }
}

export default new File()
