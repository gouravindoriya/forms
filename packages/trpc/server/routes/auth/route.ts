import { userService } from "../../services";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

import {
       createUserWithEmailAndPasswordInputModal,
       createUserWithEmailAndPasswordOutputModal,
       loginUserWithEmailAndPasswordInputModal,
       loginUserWithEmailAndPasswordOutputModal,
       getLoggedInUserInfoOutputModal,
       getLoggedInUserInfoInputModal
      
      } from './modal'
import {getAuthenticationCookie, setAuthenticationCookie} from '../../utils/cookie'      

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
    createUserWithEmailAndPassword:publicProcedure
    .meta({openapi:{
      method:'POST',
      path:getPath('/createUserWithEmailAndPassword'),
      tags:TAGS
    }})
    .input(createUserWithEmailAndPasswordInputModal)
    .output(createUserWithEmailAndPasswordOutputModal)
    .mutation(async ({input,ctx})=>{
        const { id,token } = await userService.createUserWithEmailAndPassword(input)
        setAuthenticationCookie(ctx,token)
        return { id,token }
    }),


    loginUserWithEmailAndPassword:publicProcedure
    .meta({openapi:{
      method:'POST',
      path:getPath('/loginUserWithEmailAndPassword'),
      tags:TAGS
    }})
    .input(loginUserWithEmailAndPasswordInputModal)
    .output(loginUserWithEmailAndPasswordOutputModal)
    .mutation(async ({input,ctx})=>{
      const data = await userService.loginUserWithEmailAndPassword(input)
      setAuthenticationCookie(ctx,data.token)
      return data
    }),

    getLoggedInUserInfo:publicProcedure
    .meta({openapi:{
      method:'GET',
      path:getPath('/getLoggedInUserInfo'),
      tags:TAGS
    }})
    .input(getLoggedInUserInfoInputModal)
    .output(getLoggedInUserInfoOutputModal)
    .query(async({ctx})=>{
      const userToken=getAuthenticationCookie(ctx);
      if(!userToken)throw new Error('user is not logged in')
      const {id,email,fullName,profileImage}  =await userService.verifyAndDecodeUserToken(userToken)
      return{id,email,fullName,profileImage};
    })
   
});
