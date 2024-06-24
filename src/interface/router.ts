/* eslint-disable */
import type { Response, Request, NextFunction } from "express";

export type IRouter = {
  get: (path: string, callback: (req: Request, res: Response) => void) => void;
  post: (path: string, callback: (req: Request, res: Response) => void) => void;
  put: (path: string, callback: (req: Request, res: Response) => void) => void;
  delete: (
    path: string,
    callback: (req: Request, res: Response) => void
  ) => void;
  use: (
    callback: (req: Request, res: Response, next: NextFunction) => void
  ) => void;
  listen: (port: number) => void;
};
