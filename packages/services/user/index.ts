import { 
    type createUserWithEmailAndPasswordInputType,
    type loginUserWithEmailAndPasswordInputType,
    type generateUserTokenPayloadType

} from "./modal";
import {
    createUserWithEmailAndPasswordInput,
    loginUserWithEmailAndPasswordInput,
    generateUserTokenPayload

} from './modal'
import {db,eq} from '@repo/database'
import {usersTable} from '@repo/database/models/user'
import {createHmac, randomBytes} from 'node:crypto'
import * as JWT from 'jsonwebtoken'

import {env} from '../env'
class UserService{
    private async getUserbyEmail(email:string){
        const result=await db.select().from(usersTable).where(eq(usersTable.email,email))
        if(!result || result.length===0)return null;
        return result[0]
    }

    private async createhashwithsaltandpassword(salt:string,password:string){
      return createHmac('sha256',salt).update(password).digest('hex')
    }

    private async generateJWTtoken(payload:generateUserTokenPayloadType){
        const {id}=await generateUserTokenPayload.parseAsync(payload);
        return JWT.sign({id},env.JWT_SECRET)
    }

    private async verifyUserToken(token:string):Promise<generateUserTokenPayloadType>{
        try {
           const verificationResult=  JWT.verify(token,env.JWT_SECRET) as generateUserTokenPayloadType
           return verificationResult
        } catch (error) {
            throw new Error('invalid token')
        }
    }
    private async getUserInfoById(id:string){
        const user=await db.select({
             id:usersTable.id,
             email:usersTable.email,
             fullName:usersTable.fullName,
             profileImage:usersTable.profileImageUrl
        }).from(usersTable).where(eq(usersTable.id,id))
        if(!user || user.length===0)throw new Error('user with given id does not exits')
        return user[0]!    
    }

    public async createUserWithEmailAndPassword(payload:createUserWithEmailAndPasswordInputType){
        const {fullName,email,password}=await createUserWithEmailAndPasswordInput.parseAsync(payload);
        const exitingUserWithEmail=await this.getUserbyEmail(email);
        if(exitingUserWithEmail)throw new Error(`user with email: ${email} already exits`)
        const salt= randomBytes(16).toString('hex') 
        const hash=await this.createhashwithsaltandpassword(salt,password);

        const userInsertResult=await db.insert(usersTable).values({email,fullName,password:hash,salt}).returning(
            {
                id:usersTable.id
            }
        )

        if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id)
            throw new Error('something went wrong while creating a user')
        const userId=userInsertResult[0].id;
        const token= await this.generateJWTtoken({id:userId})
        
        return {
             id:userId ,
             token:token
        }

    }

     public async loginUserWithEmailAndPassword(payload:loginUserWithEmailAndPasswordInputType){
        const {email,password}=await loginUserWithEmailAndPasswordInput.parseAsync(payload);
        
        const user =await db.select().from(usersTable).where(eq(usersTable.email,email)).limit(1);
        if(!user || user[0]?.salt==null || user[0].password==null){
            throw new Error(`user with this email ${email} dosest exit`);
        }

        const hash=await this.createhashwithsaltandpassword(user[0].salt,password);
        
        const isMatched=(hash===user[0].password)?true:false;

        if(!isMatched)throw new Error("password does not match")
        
        const token= await this.generateJWTtoken({id:user[0].id})
        
        return {
            token:token
        }
       
    }


    public async verifyAndDecodeUserToken(token:string){
        const {id}=await this.verifyUserToken(token);
        const userInfo=await this.getUserInfoById(id)
        return {...userInfo}
    }
}





export default UserService;