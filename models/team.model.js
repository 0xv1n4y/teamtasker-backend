const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Team name is required'],
        unique: true,
        trim: true,
    },
    desscription:{
        type: String,   
        default: '',
    },
    members:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],  //users in team
    createdBy : {type:mongoose.Schema.Types.ObjectId, ref:'User', required: true}

}, {timestamps: true});

// index on name for faster lookup

teamSchema.index({name: 1});

module.exports = mongoose.model('Team', teamSchema);