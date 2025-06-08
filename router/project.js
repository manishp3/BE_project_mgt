const express = require("express");
const { handleProjectCreate, handleProjectUpdate, handleProjectDelete, handleGetAllProjects, handleGetProject, handleGetProjectMembers } = require("../controller/project");
const router = express.Router();

router.post("/project_c", (req, res) => {
    console.log("log create project body::",req.body);
    
    handleProjectCreate(req, res)
})
router.get("/projects", (req, res) => {
    handleGetAllProjects(req, res)
})
router.get("/project-members/:pro_id", (req, res) => {
    handleGetProjectMembers(req, res)
})
router.get("/project/:id", (req, res) => {
    handleGetProject(req, res)
})
router.patch("/project_u/:id", (req, res) => {
    console.log("imcalled");

    handleProjectUpdate(req, res)
})
router.delete("/project_d/:id", (req, res) => {
    console.log("imcalled delete");

    handleProjectDelete(req, res)
})
module.exports = router;