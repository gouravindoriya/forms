import type { CookieOptions,Response,Request } from "express";
import { TRPCContext } from "../context";

const ONE_MINUTE=60*1000;
const ONE_HOUR=60*ONE_MINUTE;
const ONE_DAY=24*ONE_HOUR;
const ONE_WEEK=7*ONE_DAY;
const ONE_MONTH=30*ONE_DAY;
const ONE_YEAR=356*ONE_DAY;

const defaultCookieOptions:CookieOptions={
    path:'/',
    httpOnly:true,
    secure:false,
    sameSite:"strict",
    maxAge:ONE_YEAR
}

export function createCookieFactory(res:Response){
    return function createCookie(
        name:string,
        value:string,
        opts:CookieOptions=defaultCookieOptions
    ){
      return res.cookie(name,value,opts)
    }
}

export function getCookieFactory(req:Request){
    return function getCookie(
        name:string,
    ){
      return req.cookies?.[name];
    }
}

export function clearCookieFactory(res:Response){
    return function clearCookie(
        name:string,
    ){
      res.clearCookie(name)
    }
}


// Authentication Cookie
const AUTHENTICATON_COOKIE_NAME='authentication-token'
export function setAuthenticationCookie(ctx:TRPCContext,accessToken:string){
    ctx.createCookie(AUTHENTICATON_COOKIE_NAME,accessToken)
}
export function clearAuthenticationCookie(ctx:TRPCContext,){
    ctx.clearCookie(AUTHENTICATON_COOKIE_NAME)
}
export function getAuthenticationCookie(ctx:TRPCContext,){
  return  ctx.getCookie(AUTHENTICATON_COOKIE_NAME)
}