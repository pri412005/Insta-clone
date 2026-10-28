import express from "express";
import identifyUser from "../middleware/auth.middleware.js";
import { toggleFollowController, acceptFollowRequest, rejectFollowRequest, getPendingRequests,getFollowStats } from "../controller/follow.controller.js";
const followRoutes = express.Router()


followRoutes.post("/toggle/:userid", identifyUser, toggleFollowController)
followRoutes.patch("/accept/:followid",identifyUser, acceptFollowRequest)
followRoutes.patch("/reject/:followid", identifyUser, rejectFollowRequest)
followRoutes.get("/requests", identifyUser, getPendingRequests)
followRoutes.get("/stats", identifyUser, getFollowStats);

export default followRoutes;