const { ObjectId } = require('mongodb');

class Tasks {
    constructor(title, description, priority) {
        this._id = new ObjectId();
        this.title = title;
        this.description = description;
        this.priority =priority;
        this.date= new Date();
    }
}

module.exports = {
    Tasks
};
