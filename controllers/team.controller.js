const Team = require('../models/team.model');
const User = require('../models/user.model');

//Create Team

exports.createTeam = async (req, res) => {
    try {

        const {name, description} = req.body;
        if(!name){
            return res.status(400).json({message: 'Team name is required'});
        }

        const team = await Team.create({
            name,
            description,
            createdBy: req.user.id,
            members: [req.user.id], //creator is first member
        })

        res.status(201).json({message: 'Team created successfully', team});
        
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

//Get Teams

exports.getTeams = async (req, res) => {

    try {
        const team = await Team.findById(req.params.id).populate('members', 'name email role');

        if(!team) return res.status(404).json({message: 'Team not found'});

        res.status(200).json({team});

    }catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

//Add memeber to Team

exports.addNewMember = async (req, res) => {
    try {

        const { userId } = req.body;
        const {teamId} = req.params;

        if(!userId){
            return res.status(400).json({message: 'User ID is required'});
        }

        const team = await Team.findById(teamId);
        if(!team) return res.status(404).json({message: 'Team not found'}); 

        //Check if the user is already a member
        if(team.members.includes(userId)){
            return res.status(400).json({message: 'User is already a member of the team'});
        }   

        //Check if the user exists
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: 'User not found'});

        team.members.push(userId);
        await team.save();

        res.status(200).json({message: 'Member added successfully', team});

    }catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
};


//Remove member from Team

exports.removeMember = async (req, res) => {
    try {

        const { userId } = req.body;
        const {teamId} = req.params;        
        if(!userId){
            return res.status(400).json({message: 'User ID is required'});
        }
        const team = await Team.findById(teamId);
        if(!team) return res.status(404).json({message: 'Team not found'}); 

        //Check if the user is a member
        if(!team.members.includes(userId)){
            return res.status(400).json({message: 'User is not a member of the team'});
        }   
        team.members = team.members.filter(memberId => memberId.toString() !== userId);
        await team.save();

        res.status(200).json({message: 'Member removed successfully', team});

    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
};
