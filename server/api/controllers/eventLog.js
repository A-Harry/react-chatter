const EventLog = require('../models/eventLog')


exports.get_all_events = (req, res, next) => {
    EventLog.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                events: docs
            }
            res.status(200).json(response);
        })
}