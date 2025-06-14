const mongoose = require("mongoose");
const task_tbl = require("../model/tasks");
const project_tbl = require("../model/project");
const user_tbl = require("../model/index");
async function handleCreateTask(req, res) {
  const pro_id = req.params.pro_id
  const { label, summary, status, assign_to, priority, due_date } = req.body;
  const imageData = req.files?.image;
  console.log("pro_id::", pro_id);

  try {
    console.log("title,description,image::", label, summary, status);
    let taskData = {
      pro_ref: pro_id,
      label: label,
      summary: summary,
      status: status,
      priority: priority,
      due_date: due_date,
      assign_to: assign_to,

    }
    console.log("pro_id::1", pro_id);
    if (imageData) {
      console.log("pro_id::2", pro_id);
      const imgName = `${Date.now()}_${imageData.name}`
      const imagePath = `./public/uploads/${imgName}`
      console.log("pro_id::3", pro_id);
      await imageData.mv(imagePath)
      console.log("pro_id::4", pro_id);
      taskData.image = imgName
      // taskData.image = {
      //   data: imageData.data,
      //   contentType: imageData.mimetype,
      // }
      console.log("pro_id::5", taskData);
    }


    const data = await task_tbl.create(taskData)
    const task_count = await task_tbl.countDocuments({ pro_ref: pro_id })
    const data1 = await project_tbl.findByIdAndUpdate(pro_id, { total_task: task_count })
    console.log("pro_id::6", data);


    return res.status(200).json({ msg: "task added!", success: true, task: data })
  } catch (error) {
    return res.status(500).json({ msg: "Something went wrong in createTask!", success: false })
  }
}
// async function handleCreateTask(req, res) {
//   const pro_id     = req.params.pro_id;
//   const { label, summary, status, assign_to } = req.body;
//   const imageData  = req.files?.image;

//   try {
//     // 1. Validate pro_id
//     if (!mongoose.Types.ObjectId.isValid(pro_id)) {
//       return res.status(400).json({ msg: "Invalid Project ID", success: false });
//     }

//     // 2. Confirm project exists
//     const project = await project_tbl.findById(pro_id);
//     if (!project) {
//       return res.status(404).json({ msg: "Project not found", success: false });
//     }

//     // 3. Validate assign_to (if given)
//     if (assign_to) {
//       if (!mongoose.Types.ObjectId.isValid(assign_to)) {
//         return res.status(400).json({ msg: "Invalid assignee ID", success: false });
//       }
//       const user = await user_tbl.findById(assign_to);
//       if (!user) {
//         return res.status(404).json({ msg: "Assignee user not found", success: false });
//       }
//       // Ensure assignee is a member of that project
//       if (!project.members.some(m => m.toString() === assign_to)) {
//         return res.status(400).json({ msg: "Assignee is not a project member", success: false });
//       }
//     }

//     // 4. Build taskData
//     const taskData = {
//       pro_ref:   pro_id,
//       label, 
//       summary, 
//       status,
//       assign_to: assign_to || null,
//       image:     null
//     };

//     // 5. Handle image upload
//     if (imageData) {
//       const imgName   = `${Date.now()}_${imageData.name}`;
//       const imagePath = `./public/uploads/${imgName}`;
//       await imageData.mv(imagePath);
//       taskData.image = imgName;
//     }

//     // 6. Create task
//     const newTask = await task_tbl.create(taskData);
//     return res.status(201).json({
//       msg:   "Task created successfully!",
//       success: true,
//       task:  newTask
//     });

//   } catch (error) {
//     console.error("createTask error:", error);
//     return res.status(500).json({
//       msg:     "Something went wrong in createTask!",
//       success: false
//     });
//   }
// }
async function handleGetAllTasks(req, res) {
  try {
    const _id = req.params.pro_id
    console.log("_id::", _id);

    const allTask = await task_tbl.find({ pro_ref: _id }).sort({ createdAt: -1 })
    console.log("allTask::", allTask);
    if (!allTask) {
      return res.json({ msg: "No task Found!", success: false })
    }
    return res.status(200).json({ msg: "All task fetch!", success: true, tasks: allTask })
  }
  catch (err) {
    return res.status(500).json({ msg: "Something went wrong in Get All Projects!", success: false })
  }
}
async function handleGetTask(req, res) {
  const taskId = req.params.task_id;
  console.log("taskId::", taskId);

  try {
    const task = await task_tbl.findOne({ _id: taskId })
    if (!task) {
      return res.json({ msg: "No task Found!", success: false })
    }
    return res.status(200).json({ msg: "task get Success!", success: true, task: task })
  }
  catch (err) {
    return res.status(500).json({ msg: "Something went wrong in Get task!", success: false })
  }
}
async function handleUpdateTask(req, res) {
  const _id = req.params.task_id
  const { label, summary, status, assign_to, priority, due_date } = req.body;
  const imageData = req.files?.image;
  console.log("handleUpdateTask _id::", _id);
  console.log("handleUpdateTask imageData::", imageData);
  let updatedData = {}
  try {
    console.log("im called 1");

    if (label) {
      updatedData.label = label
    }
    if (priority) {
      updatedData.priority = priority
    }
    if (due_date) {
      updatedData.due_date = due_date
    }
    if (assign_to) {
      updatedData.assign_to = assign_to
    }
    console.log("im called 2");
    if (summary) {
      updatedData.summary = summary
    }
    console.log("im called 3");
    if (status) {
      updatedData.status = status
    }
    console.log("im called 4");
    if (imageData) {
      const imageName = `${Date.now()}_${imageData.name}`
      const imagePath = `./public/uploads/${imageName}`
      await imageData.mv(imagePath)
      updatedData.image = imageName
    }
    console.log("im called 5");
    const updateTask = await task_tbl.findByIdAndUpdate(_id, updatedData)
    console.log("im called 6");
    return res.status(200).json({ msg: "task Updated Success!", success: true, Updated_Task: updateTask })
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong in Update Task!", success: false, error: err })
  }
}
async function handleDeleteTask(req, res) {
  const taskId = req.params.task_id;
  console.log("taskId del::", taskId);

  try {
    const taskfind = await task_tbl.findById(taskId);
    const task = await task_tbl.findByIdAndDelete({ _id: taskId })
    if (!task) {
      return res.json({ msg: "No task Found!", success: false })

    }
    console.log("is both same task::", task);
    console.log("is both same taskfind::", taskfind);
    const pro_id = await taskfind.pro_ref;
    await project_tbl.findByIdAndUpdate(pro_id, { $inc: { total_task: -1 } })
    return res.status(200).json({ msg: "task Deleted!", success: true, task: task._id })
  }
  catch (err) {
    return res.status(500).json({ msg: "Something went wrong in Delete task!", success: false })
  }
}

module.exports = { handleCreateTask, handleDeleteTask, handleUpdateTask, handleGetTask, handleGetAllTasks };
