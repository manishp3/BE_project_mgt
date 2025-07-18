const signUp = require("../model");
const project_tbl = require("../model/project");
const task_tbl = require("../model/tasks");
const { handleOptSender } = require("../service/auth");

async function handleProjectCreate(req, res) {
    console.log("project_name, members::", req.body);
    const { project_name, members } = req.body;

    try {
        if (!project_name) {
            return res.status(404).json({ msg: "No Project name Found!", success: true })
        }
        console.log("req.user::", req.user?._id);

        const project = await project_tbl.create({
            project_name: project_name,
            pro_ref: req.user?._id,
            members: members || []
        })

        setTimeout(() => {
            console.log("im called on mail send project");
            sendMailNotificationtoMembers(project_name, members)
        }, 0);

        console.log("log of created PRioject::", project);

        return res.status(201).json({ msg: "Project Created!", success: true, data: project })
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong in project create!", success: false })

    }
}

async function handleGetAllProjects(req, res) {
    const type = req.query.type
    const { _id } = req.user
    console.log("handleGetAllProjects _id::", type);

    try {
        let allProject = [];
        // let allProject = [];

        if (type === "A") {
            allProject = await project_tbl.find({ pro_ref: _id })
                .populate("members", "_id email")
                .sort({ createdAt: -1 });

            const userData = await signUp.find({});

            const transformedProjects = allProject.map(project => {
                const transformedMembers = project.members.map(member => {
                    const matchedUser = userData.find(
                        user => user._id.toString() === member._id.toString()
                    );

                    return {
                        value: member._id,
                        label: member.email,
                        icon: matchedUser?.image || null,
                    };
                });

                return {
                    ...project.toObject(),
                    members: transformedMembers,
                };
            });

            return res.status(200).json({
                msg: "Projects Get Successfully!",
                success: true,
                projects: transformedProjects,
            });

        } else if (type === "S") {
            allProject = await project_tbl.find({ pro_ref: _id, is_star: 1 }).sort({ createdAt: -1 });
            const userData = await signUp.find({});

            const transformedProjects = allProject.map(project => {
                const transformedMembers = project.members.map(member => {
                    const matchedUser = userData.find(
                        user => user._id.toString() === member._id.toString()
                    );

                    return {
                        value: member._id,
                        label: member.email,
                        icon: matchedUser?.image || null,
                    };
                });

                console.log("to object lofg::", project);
                // console.log("to object lofg::1",...project.toObject());

                return {
                    ...project.toObject(),
                    members: transformedMembers,
                };
            });

            return res.status(200).json({
                msg: "Projects Get Successfully!",
                success: true,
                projects: transformedProjects,
            });
        }

    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong in get all projects!", success: false })
    }
}
// members dd 
async function handleGetProjectMembers(req, res) {
    const projectId = req.params.pro_id;
    try {
        const mem = await project_tbl.findById(projectId).populate("members", "email")
        console.log("log og all members::", mem);

        if (!mem) return res.status(404).json({ msg: "Project not found" });

        return res.status(200).json({ members: mem.members, success: true });
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong in get Members", success: false })
    }
}


async function handleGetProject(req, res) {
    const { id } = req.params;
    // console.log("handleGetProject id ::", id);


    try {
        const project = await project_tbl.findOne({ _id: id }).populate("members", "_id email")
        // const image = await signUp.find({ _id: project.pro_ref }).select("image -_id")
        const userData = await signUp.find({})
        // const project = await Project.findOne({ _id: id })
        console.log("handleGetProject id ::", userData);

        console.log("handleGetProject id ::1", project.members);
        const transformedMembers = project.members.map(member => {
            console.log("inseide log of me ::", userData);
            console.log("inseide log of me ::1", member);

            const matchedUser = userData.find(data => data._id.toString() === member._id.toString())
            matchedUser
            return {
                value: member._id,
                label: member.email,
                icon: matchedUser?.image,
            }
        });

        console.log("transformedMembers::", transformedMembers);

        if (!project) {
            return res.status(404).json({ msg: "project not found!", success: false })

        }
        return res.status(200).json({ msg: "Project Get Succesfully!", success: true, project: { ...project.toObject(), members: transformedMembers } })
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong in Get Single Projects!", success: false })
    }

}
async function handleProjectUpdate(req, res) {
    const { project_name, members, is_star } = req.body;
    const { id } = req.params;
    console.log("handleProjectUpdate ::1", project_name);
    // console.log("handleProjectUpdate project_name updated members::", members);
    // console.log("handleProjectUpdate id::", id);
    const mem = await project_tbl.findById(id).populate("members", "email")
    console.log("handleProjectUpdate ::1 mem", mem);
    // console.log("handleProjectUpdate members::", mem);
    try {
        console.log("handleProjectUpdate ::2 mem", mem);
        // to handle only star prject 
        if (is_star != null) {
            console.log("handleProjectUpdate ::2.1 mem");
            await project_tbl.findByIdAndUpdate(id, { is_star: is_star })
            return res.status(201).json({ msg: "Project add to Favourite!", success: true })
        }
        if (!project_name) {
            return res.status(404).json({ msg: "No Project name Found!", success: true })
        }
        if (!id && !project_name && !members && !is_star) {
            console.log("handleProjectUpdate ::2.2 mem");
            return res.status(404).json({ msg: "data not found!" })
        }
        let updateData = {}
        // if (members) {
        //     console.log("handleProjectUpdate ::2.2.1 member", members);
        //     const newMemberIds = members.map(mem => mem.value)
        //     console.log("handleProjectUpdate ::2.2.2 newMemberIds", newMemberIds);
        //     updateData.members = newMemberIds
        //     const oldProject = await project_tbl.findById(id).populate("members", "_id")
        //     console.log("handleProjectUpdate ::2.2.3 oldProject", oldProject);
        //     const oldMemberIds = oldProject.members.map(member => member._id.toString())
        //     console.log("handleProjectUpdate ::2.2.4 oldMemberIds ", oldMemberIds);
        //     const removedIds = oldMemberIds.filter(oldId => !newMemberIds.include(oldId))
        //     console.log("handleProjectUpdate ::2.2.5 removeIds ", removedIds);


        //     if (removedIds.length > 0) {
        //         console.log("handleProjectUpdate ::2.2.6");
        //         await task_tbl.updateMany(
        //             {
        //                 pro_ref: id,
        //                 assign_to: { $in: removedIds }

        //             }
        //         )
        //     }

        //     console.log("handleProjectUpdate ::2.3");


        //     let latestProjectName = ""
        //     if (project_name) {
        //         console.log("handleProjectUpdate ::2.4");
        //         latestProjectName = project_name
        //     }
        //     else {
        //         console.log("handleProjectUpdate ::2.5");
        //         const project_db = await project_tbl.findById(id).select("project_name")
        //         latestProjectName = project_db?.project_name
        //     }
        //     console.log("handleProjectUpdate ::2.6");


        // }
        if (members) {
            const newMemberIds = members.map(mem => mem.value); // from UI
            updateData.members = newMemberIds;

            // Get old members
            const oldProject = await project_tbl.findById(id).populate("members", "_id");
            const oldMemberIds = oldProject.members.map(m => m._id.toString());

            // Find removed members
            const removedMemberIds = oldMemberIds.filter(oldId => !newMemberIds.includes(oldId));

            console.log("Removed members:", removedMemberIds);

            // Set assign_to: null for all tasks assigned to removed members
            if (removedMemberIds.length > 0) {
                await task_tbl.updateMany(
                    {
                        pro_ref: id,
                        assign_to: { $in: removedMemberIds }
                    },
                    {
                        $set: { assign_to: null,time_spent:0 }
                    }
                );
            }
            let latestProjectName = ""
            if (project_name) {
                console.log("handleProjectUpdate ::2.4");
                latestProjectName = project_name
            }
            else {
                console.log("handleProjectUpdate ::2.5");
                const project_db = await project_tbl.findById(id).select("project_name")
                latestProjectName = project_db?.project_name
            }
            console.log("handleProjectUpdate ::2.6");

        }

        console.log("log of project name from db::1");
        if (project_name) {
            console.log("log of project name from db::2");
            updateData.project_name = project_name
        }

        console.log("log of project name from db::5", updateData);

        console.log("handleProjectUpdate ::2.7");
        const record = await project_tbl.findByIdAndUpdate(id, updateData)
        console.log("handleProjectUpdate ::2.8");
        console.log("log of project name from db::6", record);
        return res.status(201).json({ msg: "Project Updated!", success: true, data: record })
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong in project Update!", success: false })
    }

}
async function handleProjectDelete(req, res) {
    // const { project_name } = req.body;
    const { id } = req.params;

    console.log("handleProjectUpdate delete::", id);

    try {
        const dId = await project_tbl.findByIdAndDelete({ _id: id })
        await task_tbl.deleteMany({ pro_ref: dId._id })
        return res.status(201).json({ msg: "Project Deleted!", success: true, data: dId._id })
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong in project delete!", success: false })

    }

}

async function sendMailNotificationtoMembers(project_name, members) {
    await handleOptSender.sendMail({
        from: process.env.NODE_EMAIL_ADDRESS,
        to: members.map((mem) => mem.label), // flat array of email strings
        subject: `You’ve been added to project: ${project_name}`,
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
        <h2>You've been added to a new project!</h2>
        <p>Hello,</p>
        <p>You have been added as a <strong>member</strong> of the project <strong>"${project_name}"</strong></p>
        <p>You can now collaborate with your team, manage tasks, and track progress.</p>
        <p>If you have any questions, please contact your project admin.</p>
        <div class="footer">
          &copy; 2025 Project Management System. All rights reserved.
        </div>
      </div>
    </body>
  </html>`
    });
}
module.exports = { handleProjectCreate, handleProjectUpdate, handleProjectDelete, handleGetAllProjects, handleGetProject, handleGetProjectMembers };
