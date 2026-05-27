import {z} from 'zod'


export const createUserWithEmailAndPasswordInputModal=z.object({
    fullName:z.string().describe("full name of user"),
    email:z.email().describe("email Address of user"),
    password:z.string().describe('password of user')
})

export const createUserWithEmailAndPasswordOutputModal=z.object({
   id:z.string(),
   token:z.string()

   
})


export const loginUserWithEmailAndPasswordInputModal=z.object({
    email:z.email().describe("email Address of user"),
    password:z.string().describe('password of user')
})

export const loginUserWithEmailAndPasswordOutputModal=z.object({
   token:z.string()
})


export const getLoggedInUserInfoInputModal=z.undefined()
export const getLoggedInUserInfoOutputModal=z.object({
    id:z.string().describe('id of the user created'),
    email:z.email().describe('name of the user'),
    fullName:z.string().describe('Full Name of the user'),
    profileImage:z.string().nullable().describe("profile image url of the user")
})

