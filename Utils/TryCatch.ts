import { Request, Response, NextFunction } from "express";

export const trycatch =
  (
    controller: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<Response>
  ) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await controller(req, res, next);
    } catch (error) {
      return next(error);
    }
  };