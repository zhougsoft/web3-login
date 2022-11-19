import sql from '../db'

export interface Todo {
  id: number
  text: string
  done: boolean
}

export async function list() {
  return await sql<Todo[]>`
    SELECT id, text, done FROM todos
    ORDER BY id
  `
}

export async function create(todo: Todo) {
  return await sql<Todo[]>`
    INSERT INTO todos (text, done) VALUES (${todo.text}, false)
    RETURNING id, text, done
  `
}

export async function update(todo: Todo) {
  return await sql<Todo[]>`
    UPDATE todos SET done=${todo.done} WHERE id=${todo.id}
    RETURNING id, text, done
  `
}

export async function remove(todo: Todo) {
  return await sql<Todo[]>`
    DELETE FROM todos WHERE id=${todo.id}
    RETURNING id, text, done
  `
}
