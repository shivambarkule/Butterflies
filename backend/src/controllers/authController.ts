import { Request, Response } from 'express';

export const authController = {
  register: (_req: Request, res: Response) => { res.status(501).json({ message: 'Not implemented' }); },
  login: (_req: Request, res: Response) => { res.status(501).json({ message: 'Not implemented' }); },
  refreshToken: (_req: Request, res: Response) => { res.status(501).json({ message: 'Not implemented' }); },
  logout: (_req: Request, res: Response) => { res.status(501).json({ message: 'Not implemented' }); },
  forgotPassword: (_req: Request, res: Response) => { res.status(501).json({ message: 'Not implemented' }); },
  resetPassword: (_req: Request, res: Response) => { res.status(501).json({ message: 'Not implemented' }); },
  verifyEmail: (_req: Request, res: Response) => { res.status(501).json({ message: 'Not implemented' }); },
  getProfile: (_req: Request, res: Response) => { res.status(501).json({ message: 'Not implemented' }); }
}; 