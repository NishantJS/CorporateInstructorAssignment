import { Request } from 'express';

interface User {
  user?: string
}

export interface UserType extends Request {
  user?: User
}