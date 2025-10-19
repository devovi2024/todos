exports.createTask = (req, res) => {
    let reqBody = req.body;
    reqBody.email = req.headers['email'];

    TasksModel.create(reqBody, (err, data) => {
        if(err){
            console.log(err);
            return res.status(500).json({ message: "Task creation failed", error: err });
        } 
        res.status(201).json({ message: "Task created successfully", task: data });
    });
}

exports.updateTask = (req, res) => {
    let id = req.params.id;
    let status = req.params.status;
    let Query = { _id: id };
    let reqBody = { status: status };

    TasksModel.updateOne(Query, reqBody, (err, data) => {
        if(err){
            return res.status(500).json({ message: "Task update failed", error: err });
        }
        res.status(200).json({ message: "Task updated successfully", result: data });
    });
}

exports.deleteTask = (req, res) => {
    let id = req.params.id;
    TasksModel.deleteOne({ _id: id }, (err, data) => {
        if(err){
            return res.status(500).json({ message: "Task deletion failed", error: err });
        }
        res.status(200).json({ message: "Task deleted successfully", result: data });
    });
}

exports.listTaskByStatus = (req, res) => {
    let status = req.params.status;
    let email = req.headers['email'];

    TasksModel.aggregate([
        { $match: { status: status, email: email } },
        { $project: {
            _id: 1,
            title: 1,
            description: 1,
            status: 1,
            createdDate: {
                $dateToString: { format: "%d-%m-%Y", date: "$createdDate" }
            }
        }}
    ], (err, data) => {
        if(err){
            return res.status(500).json({ message: "Task fetch failed", error: err });
        }
        res.status(200).json({ message: "Tasks fetched successfully", tasks: data });
    });
}

exports.taskStatusCount = (req, res) => {
    let email = req.headers['email'];

    TasksModel.aggregate([
        { $match: { email: email } }, 
        { $group: { _id: "$status", count: { $sum: 1 } } } 
    ], (err, data) => {
        if(err){
            return res.status(500).json({ message: "Failed to count tasks", error: err });
        }
        res.status(200).json({ message: "Task status count fetched", counts: data });
    });
}
