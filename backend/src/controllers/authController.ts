import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';
import { AppError } from '../utils/appError';

const signToken = (id: string): string => {
  // 1. Force the secret to be a concrete string so TypeScript knows it's never undefined
  const secret: string = process.env.JWT_SECRET || 'fallback_development_secret_key_32_chars_long';
  
  // 2. Force the expiration window to be a explicit string
  const expiresInString: string = process.env.JWT_EXPIRES_IN || '1d';

  // 3. Pass the strictly verified variables into the signing engine
  return jwt.sign({ id }, secret, {
    expiresIn: expiresInString as jwt.SignOptions['expiresIn']
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('This email address is already registered.', 400));
    }

    const newUser = await User.create({ name, email, password, role });
    
    // Using the .id virtual property safely fetches the hexadecimal string representation of the ObjectId
    const token = signToken(newUser.id);

    res.status(201).json({
      status: 'success',
      token,
      data: { 
        user: { 
          id: newUser.id, 
          name: newUser.name, 
          email: newUser.email, 
          role: newUser.role 
        } 
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide both an email address and a password.', 400));
    }

    // Explicitly select the hidden password field for verification
    const user = await User.findOne({ email }).select('+password');
    
    // Safety check to verify the user exists and the bcrypt match succeeds
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email address or password.', 401));
    }

    const token = signToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
      data: { 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        } 
      },
    });
  } catch (error) {
    next(error);
  }
};