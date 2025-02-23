import express from 'express';
import {
  tripUploadPhotos,
  addTrip,
  getAllTrips,
  getTripDetails,
  updateTrip,
  deleteTrip,
} from '../controllers/tripController.js';
import upload from '../middleware/upload.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/tripPhoto',
  authMiddleware,
  upload.array('trip', 10),
  tripUploadPhotos
);

router.post('/add', authMiddleware, addTrip);
router.get('/', authMiddleware, getAllTrips);
router.get('/:id', authMiddleware, getTripDetails);
router.put(
  '/:id',
  authMiddleware,
  upload.fields([{ name: 'trip' }, { name: 'additionalPhotos' }]),
  updateTrip
);
router.delete('/:id', authMiddleware, deleteTrip);

export default router;
