 import { Hono } from "hono";
 import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables:{
        userId:string;
    }
    }>();

    blogRouter.use("/",async(c,next)=>{
        const  jwt=c.req.header("authorization")||"";
        if(!jwt){
            c.status(401)
            return c.json({error:"unauthorized"})
        }
        // const token=jwt.split('')[1]
        const payload=await verify(jwt,c.env.JWT_SECRET)
        if (!payload) {
            c.status(401);
            return c.json({ error: "unauthorized" });
        }
        // for setting we need  userId so we have to tell the type script that userid is a string in the variable part 
        else{
        c.set('userId', payload.id);}
        await next()

    })




    blogRouter.post('/', async (c) => {
        const body = await c.req.json();
        const userId = c.get("userId");
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL	,
        }).$extends(withAccelerate());
    
        
        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userId
            }
        });
        return c.json({
            id: post.id
        });
    })

    blogRouter.put('/', async (c) => {
        const userId = c.get('userId');
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL	,
        }).$extends(withAccelerate());
    
        const body = await c.req.json();
        prisma.post.update({
            where: {
                id: body.id,
                authorId: userId
            },
            data: {
                title: body.title,
                content: body.content
            }
        });
    
        return c.text('updated post');
    });
    blogRouter.get('/:id', async (c) => {
        const id = c.req.param('id');
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL	,
        }).$extends(withAccelerate());
        
        const post = await prisma.post.findUnique({
            where: {
                id
            }
        });
    
        return c.json({post});
    })
    

    blogRouter.get('/bulk', async (c) => {
        const prisma = new PrismaClient({
            datasourceUrl: c.env?.DATABASE_URL	,
        }).$extends(withAccelerate());
        //@ts-ignore
        const blogs = await prisma.blogs.findMany();
    //@ts-ignore
        return c.json({posts});
    })