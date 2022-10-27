import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser } from './../../helpers/businessLogic'
import { getUserId } from '../utils'

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    //
    try {
      const user = getUserId(event)
      const todos = await getTodosForUser(user)
      console.log('getTodos: ', todos)
      return {
        statusCode: 200,
        body: JSON.stringify(todos)
      }
    } catch (error) {
      console.log(error)
      return {
        statusCode: 500,
        body: error.message
      }
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)
