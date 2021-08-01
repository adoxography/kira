import app from './app';

const port = process.env.PORT || 5678;

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
