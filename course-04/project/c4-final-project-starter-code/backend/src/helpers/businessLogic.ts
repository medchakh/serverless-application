// import { AttachmentUtils } from './attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'
import { uuid } from 'uuidv4'
import { database, deleteS3Item } from './attachmentUtils'
// import { s3 } from './attachmentUtils'
import { createUrl, deleteItem, updatedb } from './todosAcess'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
//import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { TodosAccess } from './todosAcess'
// import * as createError from 'http-errors'
//import { CreateTodoRequest } from '../requests/CreateTodoRequest'

// TODO: Implement businessLogic
const logger = createLogger('bussness logic logger')

// env variables
// const DbIndex = process.env.TODOS_CREATED_INDEX
const DbTodoTable = process.env.TODOS_TABLE
// const urlExpiration = process.env.URL_EXP
// const bucketName = process.env.ATTACHMENT_S3_BUCKET

// const s3BucketName = process.env.ATTACHMENT_S3_BUCKET

//db is from filestorage
// logic for createToDo function
export async function createTodo(todo: {}, userId: string) {
  const date = new Date()
  const todoId = uuid()
  const newTodo = {
    todoId,
    userId,
    createdAt: date.toISOString(),
    done: false,
    attachmentUrl: '',
    ...todo
  }
  try {
    const response = await database
      .put({
        TableName: DbTodoTable,
        Item: newTodo
      })
      .promise()

    return JSON.stringify({ response, status: 'creation was okay' })
  } catch (error) {
    logger.log('error happened during creation of a todo', error.message)
    return new Error('error in createTodo, bussniess logic')
  }
}

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  //connect and query db
  const result = await database
    .query({
      TableName: DbTodoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': `${userId}` }
    })
    .promise()
  if (!result) {
    throw new Error('cannnot get todos')
  }
  const data = result.Items
  console.log(result)
  return data as TodoItem[]
}

// generateUploadurl logic
// export async function createAttachmentPresignedUrl(
//   todoid: string,
//   userId: string
// ) {
//   const createSignedUrl = await createUrl(todoid, userId)

//   if (!createSignedUrl.statusCode || createSignedUrl.statusCode === 500)
//     return new Error('cannot generate url')
//   if (createSignedUrl.statusCode)
//     return {
//       data: createSignedUrl.data,
//       statuscode: 200
//     }
// }

export async function createAttachmentPresignedUrl(
  todoid: string,
  userId: string
) {
  return await createUrl(todoid, userId)
    .then((res) => {
      console.log(res)
      return res.data
    })
    .catch((err) => console.log('createattach error ', err))
}

// deleteTodo bussn logic
export async function deleteTodo(todoid: string, userId: string) {
  const deleteFromDb = await deleteItem(todoid, userId)
  if (deleteFromDb.status !== 'ok') return Error('could not delete from db')
  try {
    await deleteS3Item(todoid)
    return { message: 'success deleting from s3', db: deleteFromDb.message }
  } catch (err) {
    return new Error('something happened in deleting from s3')
  }
}

// logic for updating
export async function updateTodo(
  updateTodo: UpdateTodoRequest,
  todoId: string,
  userId: string
) {
  const updateddb = await updatedb(updateTodo, todoId, userId)
  if (updateddb.status !== 'ok') return Error('could not update from db')
  try {
    return { message: 'success updating from database', db: updateddb.message }
  } catch (err) {
    return new Error('something happened in updating the db')
  }
}
