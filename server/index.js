import express from "express";
import dotenv from "dotenv";
import { initializeController, addShape, updateShape, deleteShape, generatePDF, getCanvas } from "./controllers/canvasControllers.js";
import cors from 'cors';


const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;



// canvas routes 
app.use(cors({
    origin: [
        "https://canvas-seven-gamma.vercel.app", 
        "http://localhost:5173"
    ],
    credentials: true
}));
app.use(express.json({ limit: '2mb' })); 
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.post('/canvas',initializeController);
app.post('/canvas/:id/shapes',addShape);
app.get('/canvas/:id/pdf', generatePDF);
app.put('/canvas/:id/shapes/:shapeId', updateShape);
app.delete('/canvas/:id/shapes/:shapeId', deleteShape);
app.get('/canvas/:id/', getCanvas);



// app.get('/', (req, res) => {
//   res.send('Hello, World!');
// }); 



// app.get('/test', (req,res)=>{
//   res.send("test route");
// })



app.listen(PORT, () => {
  console.log(`Server is running `);
});



export default app;