// import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
// import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
// import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

import { database, getUploadUrl } from './attachmentUtils'

// const XAWS = AWSXRay.captureAWS(AWS)
const bucketName = process.env.ATTACHMENT_S3_BUCKET
const DbTodoTable = process.env.TODOS_TABLE

const logger = createLogger('TodosAccess')

// // TODO: Implement the dataLayer logic

// export async function createUrl(todoid, userid) {
//   const urlPath = `https://${bucketName}.s3.amazonaws.com/${todoid}`

//   const url = await getUploadUrl(todoid)
//   try {
//     const putItemToDb = await database
//       .update({
//         TableName: DbTodoTable,
//         UpdateExpression: 'set attachmentUrl = :url',
//         ExpressionAttributeValues: { ':url': `${urlPath}` },
//         Key: {
//           todoid,
//           userid
//         }
//       })
//       .promise()
//     const res = putItemToDb
//     return {
//       statusCode: true,
//       res,
//       url
//     }
//   } catch (err) {
//     logger.log('err happened in todoaccess', err)
//     return {
//       statusCode: 500,
//       message: 'something is not right'
//     }
//   }
// }

export async function createUrl(todoId: string, userId: string) {
  try {
    const urlPath = getUploadUrl(todoId)
    const url = `https://${bucketName}.s3.amazonaws.com/${todoId}`
    // check if this work if not use other method to call db
    await database
      .update({
        TableName: DbTodoTable,
        UpdateExpression: 'set attachmentUrl = :url',
        ExpressionAttributeValues: { ':url': `${url}` },
        Key: {
          todoId,
          userId
        }
      })
      .promise()
    // test in buss logic
    return { data: urlPath, statusCode: true }
  } catch (err) {
    logger.log('err happened in todoaccess', err)
    return {
      statusCode: 500,
      message: 'something is not right'
    }
  }
}

// delete from db

export async function deleteItem(todoId: string, userId: string) {
  try {
    await database
      .delete({
        TableName: DbTodoTable,
        Key: {
          todoId,
          userId
        }
      })
      .promise()
    const res = {
      status: 'ok',
      message: 'item was deleted'
    }
    return res
  } catch (error) {
    logger.log('error occured while deleting user', error.message)
    return error
  }
}

//update db

export async function updatedb(
  updatedTodo: TodoUpdate,
  todoId: string,
  userId: string
) {
  try {
    // async
    await database
      .update({
        TableName: DbTodoTable,
        UpdateExpression: 'set #tit = :val, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: {
          ':val': `${updatedTodo.name}`,
          ':dueDate': `${updatedTodo.dueDate}`,
          ':done': `${updatedTodo.done}`
        },
        ExpressionAttributeNames: {
          '#tit': 'name'
        },
        Key: {
          todoId,
          userId
        }
      })
      .promise()
    const res = {
      status: 'ok',
      message: 'item was deleted',
      data: updatedTodo
    }
    return res
  } catch (error) {
    logger.log('error occured while updating todo', error.message)
    return error
  }
}
