import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'
import { createTodo } from './../../helpers/businessLogic'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    // getting the user
    const id = getUserId(event)
    try {
      // function in busness
      // if not work maybe remove items from client api
      const todo = await createTodo(newTodo, id)
      console.log(todo)
      return {
        statusCode: 200,
        body: JSON.stringify({
          created_item: todo
        })
      }
    } catch (error) {
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
