import {z} from 'zod'

export const createUserWithEmailAndPasswordInput=z.object({
    fullName:z.string().describe("fullname of the user").max(80),
    email:z.email().nonempty().describe("email of the user"),
    password:z.string().min(3).describe("password of the user")
})

export type createUserWithEmailAndPasswordInputType=z.infer<typeof createUserWithEmailAndPasswordInput>


export const loginUserWithEmailAndPasswordInput=z.object({
    email:z.email().nonempty().describe("email of the user"),
    password:z.string().min(3).describe("password of the user")
})

export type loginUserWithEmailAndPasswordInputType=z.infer<typeof loginUserWithEmailAndPasswordInput>

export const generateUserTokenPayload=z.object({
    id:z.string().nonempty().describe("email of the user")
})

export type generateUserTokenPayloadType=z.infer<typeof generateUserTokenPayload>
