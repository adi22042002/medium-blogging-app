// import { Hono } from 'hono';
// import { PrismaClient } from '@prisma/client/edge'
// import { withAccelerate } from '@prisma/extension-accelerate'
// import { sign } from 'hono/jwt'

// // Create the main Hono app
// const app = new Hono<{
// 	Bindings: {
// 		DATABASE_URL: string,
//     JWT_SECRET: string,
// 	}
// }>();

// app.post('/api/v1/signup',async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl:c.env.DATABASE_URL,
// }).$extends(withAccelerate())

// const body = await c.req.json();
// 	try {
// 		const user = await prisma.user.create({
// 			data: {
// 				email: body.email,
// 				password: body.password
// 			}
// 		});
//     const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
// 		return c.json({jwt})
// 	} catch(e) {
//     console.log(e)
//     c.status(411)
// 		return c.text('invalid');
// 	}
// })

// app.post('/api/v1/signin', async(c) => {
// 	const prisma = new PrismaClient({
// 		datasourceUrl: c.env?.DATABASE_URL	,
// 	}).$extends(withAccelerate());
//   const body=await c.req.json();
//   try{
//   const user = await prisma.user.findUnique({
// 		where: {
// 			email: body.email,
// 		}
// 	});
// if(!user){
//   c.status(403);
//   return c.json({error:"user no found"})
// }

// const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
// console.log('sign in successfully')
// 	return c.json({ jwt });}
//   catch(e){
//     console.log(e)
//     c.status(411)
//     return c.text('user. not found')
//   }
// })

// app.get('/api/v1/blog/:id', (c) => {
// 	const id = c.req.param('id')
// 	console.log(id);
// 	return c.text('get blog route')
// })

// app.post('/api/v1/blog', (c) => {

// 	return c.text('signin route')
// })

// app.put('/api/v1/blog', (c) => {
// 	return c.text('signin route')
// })

// export default app;



import { Hono } from 'hono'
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';

export const app = new Hono<{
  Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
  }
}>();

app.route('/api/v1/user', userRouter)
app.route('/api/v1/blog', blogRouter)

export default app

