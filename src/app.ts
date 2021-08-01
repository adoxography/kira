import express, { Request, Response, NextFunction } from 'express';
import { validate, ValidationError, Joi } from 'express-validation';
import bodyParser from 'body-parser';
import State from './state';
import findMove from './ai';
import { EMPTY, P1, P2 } from './constants';

const statusValidation = {
  query: Joi.object({
    width: Joi.number().integer().required(),
    height: Joi.number().integer().required(),
    k: Joi.number().integer().required(),
    timePerMove: Joi.number().min(1).required()
  })
};

const moveValidation = {
  body: Joi.object({
    width: Joi.number().integer().required(),
    height: Joi.number().integer().required(),
    cells: Joi.array()
      .length(Joi.expression('{{width * height}}'))
      .items(
        Joi.valid(EMPTY),
        Joi.valid(P1),
        Joi.valid(P2)
      )
      .required(),
    k: Joi.number().integer().required(),
    timePerMove: Joi.number().min(1).required(),
    turn: Joi.valid(P1, P2).required()
  })
};

const app = express();
app.use(bodyParser.json());

app.get('/status', validate(statusValidation, {}, { abortEarly: false }), (req, res) => {
  res.status(200).send();
});

app.post('/move', validate(moveValidation, {}, { abortEarly: false }), async (req, res) => {
  const {
    width,
    height,
    cells,
    turn,
    timePerMove,
    k: kToWin
  } = req.body;

  const state = State.fromParams({
    width,
    height,
    cells,
    turn,
    kToWin
  });

  const bestMove = await findMove(state, timePerMove * 1000);

  res.status(200).send(bestMove.toString());
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ValidationError) {
    return res.status(400).json(err);
  }

  return res.status(500).json(err);
});

export default app;
