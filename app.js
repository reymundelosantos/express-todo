import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import router from './src/routes/index.js';

dotenv.config()

const app = express();
app.use(express.json()); 
app.use('/api', router);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });
