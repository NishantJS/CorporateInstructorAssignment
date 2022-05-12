import { Request } from 'express';

interface User {
  user?: string
}

export interface UserType extends Request {
  user?: User,
}



export interface MulterFile {
  path: string // Available using `DiskStorage`.
  mimetype: string
  originalname: string
  size: number
}
