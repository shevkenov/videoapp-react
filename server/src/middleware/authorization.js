import {PrismaClient} from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient()

export async function getAuthUser(req, res, next) {
    const token = req.headers.authorization;
    
    if(!token) {
        req.user = null
        return next();
    }else{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: {
                id: decode.id
            },
            include:{
                videos: true
            }
        })
        
        req.user = user
        next();
    }
}

export async function protect(req, res, next) {
    const token = req.headers.authorization;
    
    if(!token) {
        next({
            message: 'You need tokens!',
            statusCode: 401
        })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: {
                id: decode.id
            },
            include:{
                videos: true
            }
        })
        
        req.user = user
        next();
    } catch (error) {
        next({
            message: 'You need to be logged in to access this route!',
            statusCode: 401
        })
    }
}
