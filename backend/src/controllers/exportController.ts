import { Request, Response, NextFunction } from 'express';
import { Lead } from '../models/leadModel';

export const exportLeadsToCSV = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Force browser down-stream parsing headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads_export.csv');

    // Write CSV Columns Header Row
    res.write('ID,Name,Email,Status,Source,Created At\n');

    // Stream-cursor processing to efficiently read heavy database targets
    const leadCursor = Lead.find().cursor();

    for (let lead = await leadCursor.next(); lead != null; lead = await leadCursor.next()) {
      const sanitizedName = lead.name.replace(/"/g, '""');
      const csvRow = `"${lead._id}","${sanitizedName}","${lead.email}","${lead.status}","${lead.source}","${lead.createdAt.toISOString()}"\n`;
      res.write(csvRow);
    }

    res.end();
  } catch (error) {
    next(error);
  }
};