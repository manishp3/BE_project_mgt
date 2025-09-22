const mongoose = require("mongoose");
const task_tbl = require("../model/tasks");
const project_tbl = require("../model/project");
const user_tbl = require("../model/index");
const { handleOptSender } = require("../service/auth");
const signUp = require("../model/index");
async function handleCreateTask(req, res) {
  const pro_id = req.params.pro_id
  const { label, summary, status, priority, due_date } = req.body;
  const assign_to = JSON.parse(req?.body?.assign_to);
  const imageData = req.files?.image;
  console.log("pro_id::", req.body);
  // console.log("assign_to :: from me", assign_to);

  try {
    if (label == "" || label == null) {
      return res.status(201).json({ msg: "Label is required", success: false })
    }
    console.log("title,description,image::", label, summary, status);
    let taskData = {
      pro_ref: pro_id,
      label: label,
      summary: summary,
      status: status || "To Do",
      priority: priority || "Normal",
      due_date: due_date,
      assign_to: assign_to?.value || null,
      time_spent: 0,

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
    }
    console.log("pro_id::5", taskData);


    const data = await task_tbl.create(taskData)
    console.log("pro_id::5.1", data);
    const task_count = await task_tbl.countDocuments({ pro_ref: pro_id })
    console.log("pro_id::5.2", data);
    // to find name of project 
    const project_name = await project_tbl.findById(pro_id)
    console.log("pro_id::5.3", project_name);
    assign_to && setTimeout(() => {
      console.log("im called on mail send task");

      sendMailNotificationtoMembersofTask(project_name?.project_name, label, assign_to?.label)
    }, 0);
    const data1 = await project_tbl.findByIdAndUpdate(pro_id, { total_task: task_count })
    // console.log("pro_id::5.2", data);
    console.log("pro_id::6", data1);


    return res.status(200).json({ msg: "task Created!", success: true, task: data })
  } catch (error) {
    return res.status(500).json({ msg: "Something went wrong in createTask!", success: false })
  }
}
async function handleUpdateTask(req, res) {
  const _id = req.params.task_id
  const { label, summary, status, priority, due_date, time_spent } = req.body;
  const imageData = req.files?.image;
  const assign_to = req.body.assign_to && JSON.parse(req?.body?.assign_to);
  console.log("handleUpdateTask _id::", _id);
  console.log("handleUpdateTask label, summary, status, priority, due_date, time_spent::", label, summary, status, priority, due_date, time_spent);
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
      updatedData.assign_to = assign_to.value || null
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
    const findTask = await task_tbl.findById(_id)
    console.log("im called 6", findTask);
    if (time_spent) {
      console.log("im called 5");
      if (findTask.time_spent >= 0) {
        updatedData.time_spent = time_spent + findTask.time_spent
        console.log("im called 7");
      }
      else {
        console.log("im called 7 or ");
        updatedData.time_spent = time_spent
      }
    }
    console.log("im called 8 ");

    // console.log("im called 4");
    if (imageData) {
      console.log("im called 9");
      const imageName = `${Date.now()}_${imageData.name}`
      const imagePath = `./public/uploads/${imageName}`
      await imageData.mv(imagePath)
      updatedData.image = imageName
    }
    console.log("im called 10");

    const updateTask = await task_tbl.findByIdAndUpdate(_id, updatedData, { new: true })
    console.log("im called 11");

    const projectData = await project_tbl.find({ _id: findTask.pro_ref })
    console.log("im called 12", projectData);

    assign_to && setTimeout(() => {
      console.log("im called on mail send task");

      sendMailNotificationtoMembersofTask(projectData[0]?.project_name, findTask.label, assign_to?.label)
    }, 0);
    return res.status(200).json({ msg: "task Updated!", success: true, Updated_Task: updateTask })
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong in Update Task!", success: false, error: err })
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
const handleGetAllTasks = async (req, res) => {
  try {
    const _id = req.params.pro_id;

    console.log("_id::", _id);

    // 1. Get the project with members
    const project = await project_tbl.findById(_id).populate("members", "_id");

    if (!project) {
      return res.status(404).json({ msg: "Project not found!", success: false });
    }

    const memberIds = project.members.map((m) => m._id.toString());

    // 2. Get all tasks and populate assign_to with image and email
    const allTasks = await task_tbl
      .find({ pro_ref: _id })
      .sort({ createdAt: -1 })
      .populate("assign_to", "email image");

    if (!allTasks || allTasks.length === 0) {
      return res.json({ msg: "No tasks found!", success: true, tasks: [] });
    }

    // 3. Filter or clean assign_to
    const tasksWithValidUsers = allTasks.map((task) => {
      const assignedUser = task.assign_to;

      const isValid = assignedUser && memberIds.includes(assignedUser._id.toString());

      return {
        ...task.toObject(),
        assign_to: isValid
          ? {
            _id: assignedUser._id,
            email: assignedUser.email,
            image: assignedUser.image,
          }
          : null, // Or leave assign_to as is if you want to show invalid ones
      };
    });

    return res.status(200).json({
      msg: "All tasks fetched!",
      success: true,
      tasks: tasksWithValidUsers,
    });
  } catch (err) {
    console.error("Error in handleGetAllTasks:", err);
    return res.status(500).json({
      msg: "Something went wrong in Get All Tasks!",
      success: false,
    });
  }
};

async function handleGetTask(req, res) {
  const taskId = req.params.task_id;
  console.log("taskId::", taskId);

  try {
    const task = await task_tbl.findOne({ _id: taskId })
    if (!task) {
      return res.json({ msg: "No task Created!", success: true, task: [] })
    }
    return res.status(200).json({ msg: "task get Success!", success: true, task: task })
  }
  catch (err) {
    return res.status(500).json({ msg: "Something went wrong in Get task!", success: false })
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

// const getProjectMemberDetails = async (req, res) => {
//   // get all project and its member ->by project id get all task 
//   // find project by members_id get user and using project members id get all task of it and its hour
//   const ProjectMembers = await project_tbl.find().select("members")
//   console.log("getProjectMemberDetails:: projects", ProjectMembers);
//   const allMembers = await signUp.find()
//   console.log("getProjectMemberDetails:: allMembers", allMembers);

//   //   const taskWiseData=ProjectMembers.find((member)=>{
//   // allMembers.find()
//   //   })
//   const users = ProjectMembers.map((member) => {
//     console.log("ProjectMembers membres::", member);
//     let totalTaskHour = 0;
//     const findUsers = member.map(async (mem) => {
//       if (mem == allMembers._id) {
//         totalTaskHour += await task_tbl.find({ assign_to: allMembers._id }).select("time_spent")
//       }
//       return totalTaskHour;
//     })
//   })
//   console.log(" log of users ::",users);


//   return res.status(201).json({
//     // allMembers,
//     ProjectMembers
//   })
// }


const getProjectMemberDetails = async (req, res) => {
  try {
    const loggedUserId = req.user._id
    // Step 1: Get all project members
    const allProjects = await project_tbl.find({ pro_ref: loggedUserId }).select("members");
    const memberIdsSet = new Set();

    allProjects.forEach(project => {
      project.members.forEach(memberId => memberIdsSet.add(memberId.toString()));
    });

    const uniqueMemberIds = [...memberIdsSet];

    // Step 2: Fetch user details
    const users = await signUp.find({ _id: { $in: uniqueMemberIds } }).select("username email image role");

    // Step 3: For each user, calculate total hours and tasks
    const result = await Promise.all(users.map(async (user) => {
      const tasks = await task_tbl.find({ assign_to: user._id }).select("time_spent");

      const total_spending_hour = tasks.reduce((sum, task) => sum + (task.time_spent || 0), 0);
      const total_tasks = tasks.length;

      return {
        name: user.username,
        email: user.email,
        image: user.image,
        role: user.role,
        total_spending_hour,
        total_tasks
      };
    }));

    return res.status(200).json({ members: result, success: true });
  } catch (error) {
    console.error("Error in getProjectMemberDetails:", error);
    return res.status(500).json({ success: false, message: "Internal server error", success: false });
  }
};

async function handleUserProjectsAndTaskDetails(req, res) {
  const loggedUserId = req.user._id;
  console.log("loggedUserId::", loggedUserId);
  try {
    const totalTasks = await project_tbl
      .find({ pro_ref: loggedUserId })


    const totalTaskCount = totalTasks.reduce((sum, project) => {
      return sum + (project.total_task || 0);
    }, 0);

    console.log("loggedUserId:: totalTaskCount", totalTaskCount);
    const totalProjects = await project_tbl.find({ pro_ref: loggedUserId })
    console.log("loggedUserId:: totalProjects", totalProjects.length);
    // let totalTasksCount = 0;
    let totalHours = 0;
    let todoHours = 0;
    let inProgressHours = 0;
    let doneHours = 0;

    let todoCount = 0;
    let inProgressCount = 0;
    let doneCount = 0;

    const allTask = await Promise.all(totalProjects.map(async (Project) => {
      const tasks = await task_tbl.find({ pro_ref: Project._id }).select("time_spent status")
      return tasks
    }))

    const flatTasks = allTask.flat()
    console.log("loggedUserId::1 flatTasks", flatTasks);

    flatTasks.forEach(task => {

      console.log("flatTasks.forEach::", task);

      if (task.status == "To Do") {
        todoCount++;
        totalHours += extractHours(task?.time_spent)
        todoHours += extractHours(task?.time_spent)
      }
      else if (task.status == "In Progress") {
        inProgressCount++;
        totalHours += extractHours(task?.time_spent)
        inProgressHours += extractHours(task?.time_spent)
      }
      else if (task.status == "Done") {
        doneCount++;
        totalHours += extractHours(task?.time_spent)
        doneHours += extractHours(task?.time_spent)
      }
    });
    console.log("loggedUserId::1 totalProjects", allTask);
    // console.log("loggedUserId::1 totalTasksCount", totalTasksCount);
    return res.json({ tasks: totalTaskCount, success: true, done_task: { task: doneCount, hours: doneHours }, inprogress_task: { task: inProgressCount, hours: inProgressHours }, todo_task: { task: todoCount, hours: todoHours }, total_projects: totalProjects.length, total_hours: totalHours, success: true })
  }
  catch (error) {
    console.error("Error in getProjectMemberDetails:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function getprojectProgressDashboard(req, res) {
  const userId = req.user._id;

  try {
    const projects = await project_tbl.find({ pro_ref: userId });

    let CompletedCount = 0;
    let inProgressCount = 0;
    let yetToStartCount = 0;

    let CompletedHour = 0;
    let inProgressHour = 0;
    let YeToStartHour = 0;

    await Promise.all(
      projects.map(async (project) => {
        const tasks = await task_tbl.find({ pro_ref: project._id });

        if (tasks.length === 0 || tasks.every(task => task.status === "To Do")) {
          yetToStartCount++;
          YeToStartHour += tasks.reduce((sum, task) => sum + (task.time_spent || 0), 0);
        } else if (tasks.every(task => task.status === "Done")) {
          CompletedCount++;
          // Sum hours if needed
          CompletedHour += tasks.reduce((sum, task) => sum + (task.time_spent || 0), 0);
        } else {
          inProgressCount++;
          inProgressHour += tasks.reduce((sum, task) => sum + (task.time_spent || 0), 0);
        }
      })
    );

    return res.status(200).json({
      CompletedProjects: CompletedCount,
      YeToStartHour: YeToStartHour,
      inProgressProjects: inProgressCount,
      yetToStartProjects: yetToStartCount,
      totalProjects: projects.length,
      CompletedHour,
      inProgressHour,
      msg: "Project progress summary fetched successfully",
      success: true,
    });

  } catch (err) {
    console.error("Error in getProjectProgressDashboard:", err);
    return res.status(500).json({
      msg: "Something went wrong in get project progress",
      success: false,
    });
  }
}

async function getarrivalExpiryTasks(req, res) {
  const userId = req.user._id;
  try {
    const projects = await project_tbl.find({ pro_ref: userId })
    console.log("all projects of register user::", projects);

    // const allTasks =await Promise.All(
    //    projects.map(async (project) => {
    //     const tasks = await task_tbl.find({ pro_ref: project._id })
    //     return tasks
    //   })
    // )
    const allTasks = await Promise.all(
      projects.map(async (project) => {
        const tasks = await task_tbl.find({ pro_ref: project._id });
        const enhancedTask = tasks.map((task) => ({
          ...task.toObject(),
          project_id: project._id
        }))
        return enhancedTask; // array of tasks per project
      })
    );
    console.log("all projects of register user::1", allTasks);
    const flatTasks = allTasks.flat();
    const today = new Date()
    const startDays = new Date(Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate()
    ))
    const endOfSecondDayUTC = new Date(Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate() + 2,
      23, 59, 59
    ));

    // const targetDateStr = startDays.toISOString().split('T')[0]
    const due_tasks = flatTasks.filter(task => {
      // if (!task.due_date) return false;
      // const taskDatestr = new Date(task.due_date).toISOString().split('T')[0]
      // return taskDatestr < targetDateStr
      const dueDate = new Date(task.due_date);
      return dueDate >= startDays && dueDate <= endOfSecondDayUTC;
    })
    console.log("due_tasks due_tasks::", due_tasks);

    return res.status(200).json({ msg: "get soon exipiry tasks", data: due_tasks, success: true })
  } catch (error) {
    console.error("Error in getProjectMemberDetails:", error);
    return res.status(500).json({ success: false, message: "Internal server error", success: false });
  }
}

async function sendMailNotificationtoMembersofTask(project_name, task_name, email) {
  await handleOptSender.sendMail({
    from: process.env.NODE_EMAIL_ADDRESS,
    to: email, // flat array of email strings
    subject: `You’ve got task from: ${project_name}`,
    html: `<html>
    <head>
      <meta charset="UTF-8" />
      <title>Project Assignment</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.05);
        }
        h2 {
          color: #333333;
        }
        p {
          color: #555555;
          line-height: 1.6;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #999999;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <p>You've been Assigned new task!</p>
        <p>${task_name}</p>
        <div class="footer">
          &copy; 2025 Project Management System. All rights reserved.
        </div>
      </div>
    </body>
  </html>`
  });
}


function extractHours(timeStr) {
  const parsed = parseInt(timeStr); // "8h" → 8, "" → NaN
  return isNaN(parsed) ? 0 : parsed;
}

module.exports = { handleCreateTask, handleDeleteTask, handleUpdateTask, handleGetTask, handleGetAllTasks, handleUserProjectsAndTaskDetails, getProjectMemberDetails, getprojectProgressDashboard, getarrivalExpiryTasks };
