import AWS from 'aws-sdk'
import {
  PutObjectRequest,
  ListObjectsV2Output,
  GetObjectOutput,
} from 'aws-sdk/clients/s3'
import IBucketAdapter from './IBucketAdapter'
import logger from '../../../services/logging'

export enum FilesFormat {
  PDF = 'pdf',
  PNG = 'png',
}

export default class BucketAdapter implements IBucketAdapter {
  private readonly s3: AWS.S3

  private readonly bucketName: string

  private static readonly contentTypeMap: Record<FilesFormat, string> = {
    pdf: 'application/pdf',
    png: 'image/png',
  }

  constructor(s3: AWS.S3, bucketName: string) {
    this.s3 = s3
    this.bucketName = bucketName
  }

  async upload(
    data: string,
    fileName: string,
    extension: FilesFormat
  ): Promise<string> {
    logger.info({ message: `Uploading ${fileName} to S3 bucket` })

    const params: PutObjectRequest = {
      Bucket: this.bucketName,
      Key: `${fileName}.${extension}`,
      Body: Buffer.from(data, 'base64'),
      ContentType: BucketAdapter.contentTypeMap[extension],
    }

    const response = await this.s3.upload(params).promise()
    logger.info({
      message: `Successfully uploaded ${fileName}.${extension} to S3 bucket ${this.bucketName}`,
    })
    return response.Location
  }

  /**
   * Fetches all objects which filename starts with the given prefix and the content type matches the given extension.
   * Returns an array of data urls encoded in base64.
   * @param prefix
   * @param extension
   */
  async getObjectsByPrefixAndContentType(
    prefix: string,
    extension: FilesFormat
  ): Promise<string[]> {
    logger.info({
      message: `Fetching list of objects with prefix '${prefix}' from S3 bucket`,
    })

    const response: ListObjectsV2Output = await this.s3
      .listObjectsV2({
        Bucket: this.bucketName,
        Prefix: prefix,
      })
      .promise()

    const list = response.Contents || []

    logger.info({
      message: `Successfully fetched list of objects with prefix '${prefix}' from S3 bucket: ${list.length} objects found`,
    })

    if (list.length === 0) {
      return []
    }

    logger.info({ message: 'Fetching objects contents from S3 bucket' })

    const objects = await Promise.all(
      list.map((entry: Record<string, any>) =>
        this.s3
          .getObject({
            Bucket: this.bucketName,
            Key: entry.Key as string,
          })
          .promise()
      )
    )

    logger.info({
      message: 'Successfully fetched objects contents from S3 bucket',
    })

    const contentType = BucketAdapter.contentTypeMap[extension]

    return objects
      .filter(({ ContentType }: GetObjectOutput) => ContentType === contentType)
      .reduce((result: string[], object: GetObjectOutput) => {
        if (!object.Body) {
          return result
        }

        //@ts-ignore
        return [...result, Buffer.from(object.Body).toString('base64')]
      }, [])
  }
}
