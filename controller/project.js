const Project = require("../model/project");
const task_tbl = require("../model/tasks");

async function handleProjectCreate(req, res) {
    console.log("project_name, members::", req.body);
    const { project_name, members } = req.body;

    try {
        if (!project_name) {
            return res.status(404).json({ msg: "No Project name Found!", success: true })
        }
        console.log("req.user::", req.user?._id);

        const project = await Project.create({
            project_name: project_name,
            pro_ref: req.user?._id,
            members: members || []
        })
        console.log("log of created PRioject::", project);

        return res.status(201).json({ msg: "Project Created!", success: true, data: project })
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong in project create!", success: false })

    }
}

async function handleGetAllProjects(req, res) {
    const { _id } = req.user
    console.log("handleGetAllProjects _id::", req.user);

    try {
        const allProject = await Project.find({ pro_ref: _id })
        return res.status(200).json({ msg: "Projects Get Succesfully!", success: true, projects: allProject })
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong in get all projects!", success: false })
    }

}
// members dd 
async function handleGetProjectMembers(req, res) {
    const projectId = req.params.pro_id;
    try {
        const mem = await Project.findById(projectId).populate("members", "email")
        console.log("log og all members::", mem);

        if (!mem) return res.status(404).json({ msg: "Project not found" });

        return res.status(200).json({ members: mem.members });
    } catch (err) {
        return res.status(500).json({ msg: "Something went wrong in get Members", success: false })
    }
}


async function handleGetProject(req, res) {
    const { id } = req.params;
    console.log("handleGetProject id ::", id);

    try {
        const project = await Project.findOne({ _id: id })
        if (!project) {
            return res.status(404).json({ msg: "project not found!", success: false })

        }
        return res.status(200).json({ msg: "Project Get Succesfully!", success: true, project: project })
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong in Get Single Projects!", success: false })
    }

}
async function handleProjectUpdate(req, res) {
    const { project_name, members } = req.body;
    const { id } = req.params;
    console.log("handleProjectUpdate project_name::", project_name);
    console.log("handleProjectUpdate id::", id);

    try {
        let updateData = {}
        if (!id || !project_name) {
            return res.status(404).json({ msg: "data not found!" })
        }
        if (members) {
            updateData.members = members
        }
        if (project_name) {
            updateData.project_name = project_name
        }
        const record = await Project.findByIdAndUpdate(id, updateData)
        // const record = await Project.findByIdAndUpdate(id, {
        //     project_name: project_name
        // })
        console.log("handleProjectUpdate record::", record);
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
        const dId = await Project.findByIdAndDelete({ _id: id })
        await task_tbl.deleteMany({pro_ref:dId._id})
        return res.status(201).json({ msg: "Project Deleted!", success: true, data: dId._id })
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong in project delete!", success: false })

    }

}

module.exports = { handleProjectCreate, handleProjectUpdate, handleProjectDelete, handleGetAllProjects, handleGetProject, handleGetProjectMembers };
