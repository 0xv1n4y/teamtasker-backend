const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');


//Create team — only manager or admin
router.post('/', authMiddleware, roleMiddleware('manager', 'admin'), teamController.createTeam);

// Get team details (auth optional, let's require auth)
router.get('/:id', authMiddleware, teamController.getTeams);

//add member -only manager or admin
router.post('/:teamId/members', authMiddleware, roleMiddleware('manager', 'admin'), teamController.addNewMember);

//remove member from team
router.delete('/:teamId/members', authMiddleware, roleMiddleware('manager', 'admin'), teamController.removeMember);

module.exports = router;