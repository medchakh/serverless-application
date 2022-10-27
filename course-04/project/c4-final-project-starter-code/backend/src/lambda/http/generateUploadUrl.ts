import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from './../../helpers/businessLogic'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    try {
      const userId = await getUserId(event)
      const getUrl = await createAttachmentPresignedUrl(todoId, userId)
      return {
        statusCode: 201,
        body: JSON.stringify({
          uploadUrl: getUrl
        })
      }
    } catch (err) {
      return {
        statusCode: 500,
        body: err.message
      }
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
