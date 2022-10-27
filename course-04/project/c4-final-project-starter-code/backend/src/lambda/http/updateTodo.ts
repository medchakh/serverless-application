import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from './../../helpers/businessLogic'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const user = await getUserId(event)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    return await updateTodo(updatedTodo, todoId, user)
      .then((res) => {
        return {
          statusCode: 200,
          body: JSON.stringify({
            data: res
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
