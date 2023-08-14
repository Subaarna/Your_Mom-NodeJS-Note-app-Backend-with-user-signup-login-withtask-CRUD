const { ObjectId } = require('mongodb');

class Tasks {
    constructor(title, description, priority, userId) {
        this._id = new ObjectId();
        this.userId = userId
        this.title = title;
        this.description = description;
        this.priority =priority;
        this.date= new Date();
    }
}

module.exports = {
    Tasks
};
