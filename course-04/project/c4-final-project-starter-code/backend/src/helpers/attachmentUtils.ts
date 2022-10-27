import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
//import { getDocumentClient } from '@shelf/aws-ddb-with-xray'

// TODO: Implement the fileStogare logic
// const awsRegion = process.env.REGION
const XAWS = AWSXRay.captureAWS(AWS)
// env variables
const urlExpiration = process.env.URL_EXP
const bucketName = process.env.ATTACHMENT_S3_BUCKET
//db
export const database = new AWS.DynamoDB.DocumentClient()

//storage
export const S3 = new XAWS.S3({
  signatureVersion: 'v4'
})
//generate url
export function getUploadUrl(todoID: string) {
  return S3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoID,
    Expires: parseInt(urlExpiration)
  })
}

// delete from s3
export function deleteS3Item(todoId: string) {
  // use then/catch in bussness logic
  S3.deleteObject(
    {
      Bucket: bucketName,
      Key: todoId
    },
    function (error) {
      if (error) throw new Error('error happened when deleteing from s3')
    }
  )
}
