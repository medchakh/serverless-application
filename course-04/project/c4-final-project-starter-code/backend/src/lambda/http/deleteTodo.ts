import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from './../../helpers/businessLogic'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    const userId = await getUserId(event)

    return await deleteTodo(todoId, userId)
      .then((res) => {
        return {
          statusCode: 200,
          body: JSON.stringify({
            res
          })
        }
      })
      .catch((err) => {
        return {
          statusCode: 500,
          body: JSON.stringify({
            err
          })
        }
      })
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
