import app from './app';

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Listening on port ${port}!`);
});
