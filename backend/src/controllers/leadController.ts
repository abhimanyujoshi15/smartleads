import { Request, Response, NextFunction } from 'express';
import { Lead, LeadStatus, LeadSource } from '../models/leadModel';
import { AppError } from '../utils/appError';

// Interface for handling strict typing across incoming query structures
interface LeadQueryFilters {
  status?: string;
  source?: string;
  search?: string;
  sort?: 'Latest' | 'Oldest';
  page?: string;
  limit?: string;
}

export const getAllLeads = async (
  req: Request<{}, {}, {}, LeadQueryFilters>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, source, search, sort, page, limit } = req.query;

    // 1. Build Dynamic Filter Query Object
    const queryObj: any = {};

    if (status) {
      queryObj.status = status;
    }
    if (source) {
      queryObj.source = source;
    }
    if (search) {
      // Regex search handling for partial matches across both Name and Email
      queryObj.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // 2. Set Up Pagination Configuration
    const currentPage = parseInt(page || '1', 10);
    const executionLimit = parseInt(limit || '10', 10);
    const skipRecords = (currentPage - 1) * executionLimit;

    // 3. Set Up Sorting Options
    let sortOrder: any = { createdAt: -1 }; // Default: Latest
    if (sort === 'Oldest') {
      sortOrder = { createdAt: 1 };
    }

    // 4. Database Pipeline Execution
    const totalRecords = await Lead.countDocuments(queryObj);
    const leads = await Lead.find(queryObj)
      .sort(sortOrder)
      .skip(skipRecords)
      .limit(executionLimit);

    // 5. Build Metadata-Rich Envelope Responding Structure
    res.status(200).json({
      status: 'success',
      meta: {
        totalRecords,
        currentPage,
        totalPages: Math.ceil(totalRecords / executionLimit),
        limit: executionLimit,
      },
      data: { leads },
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return next(new AppError('No lead found with that identifier.', 404));
    }
    res.status(200).json({ status: 'success', data: { lead } });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, status, source } = req.body;
    const newLead = await Lead.create({ name, email, status, source });

    res.status(201).json({ status: 'success', data: { lead: newLead } });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedLead) {
      return next(new AppError('No lead found with that identifier.', 404));
    }

    res.status(200).json({ status: 'success', data: { lead: updatedLead } });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return next(new AppError('No lead found with that identifier.', 404));
    }

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};