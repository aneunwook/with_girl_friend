import express from 'express';
import  {tripUploadPhotos, addTrip, getAllTrips, getTripDetails} from '../controllers/tripController.js'

const router = express.Router();

router.post('/tripPhoto', upload.array('trip', 10), tripUploadPhotos);

router.post('/add', addTrip);
router.get('/', getAllTrips);
router.get('/:id', getTripDetails);

export default router;