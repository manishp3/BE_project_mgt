const express = require("express");
const { handleCreateTask,handleGetAllTasks,handleGetTask, handleUpdateTask, handleDeleteTask,handleUserProjectsAndTaskDetails,getProjectMemberDetails,getprojectProgressDashboard,getarrivalExpiryTasks } = require("../controller/tasks");
const router = express.Router()

router.post("/createtask/:pro_id", (req, res) => {
    console.log("createtask::",req.body);
    
    handleCreateTask(req, res)
})
router.get("/gettasks/:pro_id", (req, res) => {
    // get all task of single project only
    handleGetAllTasks(req, res)
})
router.get("/gettask/:task_id", (req, res) => {
    handleGetTask(req, res)
})
router.patch("/task_u/:task_id", (req, res) => {
    handleUpdateTask(req, res)
})
router.delete("/task_d/:task_id", (req, res) => {
    handleDeleteTask(req, res)
})
router.get("/user_project_detail", (req, res) => {
    handleUserProjectsAndTaskDetails(req, res)
})
router.get("/get_member_full_detail", (req, res) => {
    getProjectMemberDetails(req, res)
})
router.get("/project_progress", (req, res) => {
    getprojectProgressDashboard(req, res)
})
router.get("/soon_expiry_task", (req, res) => {
    getarrivalExpiryTasks(req, res)
})

// router.get("/find_status",(req,res)=>{
//     handleFindTotalTaskAndStatus(req,res)
// })
module.exports = router;