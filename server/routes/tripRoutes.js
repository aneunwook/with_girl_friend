import express from 'express';
import  {tripUploadPhotos, addTrip, getAllTrips, getTripDetails, updateTrip, deleteTrip} from '../controllers/tripController.js'
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/tripPhoto', upload.array('trip', 10), tripUploadPhotos);

router.post('/add', addTrip);
router.get('/', getAllTrips);
router.get('/:id', getTripDetails);
router.put('/editTrip/:id', updateTrip);
router.delete('/:id', deleteTrip);

export default router;