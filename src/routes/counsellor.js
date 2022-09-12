const { getCounsellor, createCounsellor, editCounsellor } = require('../controllers/counsellorController');
const { isAdmin, isDoctorOrAdmin } = require('../middlewares/roleValidation');

const router = require('express').Router()



router.get('/profile/:id', getCounsellor)

router.post('/new-counsellor', isAdmin, createCounsellor)

router.post('/edit-counsellor', isDoctorOrAdmin, editCounsellor)


module.exports = router;
