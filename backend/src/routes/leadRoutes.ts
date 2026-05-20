import { Router } from 'express';
import { 
  getAllLeads, 
  getLeadById, 
  createLead, 
  updateLead, 
  deleteLead 
} from '../controllers/leadController';
import { exportLeadsToCSV } from '../controllers/exportController';
import { protect, restrictTo } from '../middleware/authMiddleware';
import { UserRole } from '../models/userModel';

const router = Router();

// Apply auth protective wall globally across all standard operations
router.use(protect);

router.get('/export', restrictTo(UserRole.ADMIN), exportLeadsToCSV);

router.route('/')
  .get(getAllLeads)
  .post(createLead);

router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(restrictTo(UserRole.ADMIN), deleteLead);

export default router;