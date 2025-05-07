const express = require("express");
const matkaRouter = express.Router();
const matkaController = require("../controller/matkaController");

matkaRouter.delete("/api/admin/deleteMarket/:id", matkaController.deleteMarket);
matkaRouter.put("/api/admin/updateMarket/:id", matkaController.updateMarket);
matkaRouter.get("/api/admin/getMatkas", matkaController.getcreatedDetail);  
matkaRouter.post("/api/admin/creatematka", matkaController.createMatka);        
matkaRouter.get("/api/matka", matkaController.getAllMatka);       
matkaRouter.get("/api/matka/:id", matkaController.getMatkaById);   
matkaRouter.put("/api/matka/:id", matkaController.updateMatka);     
matkaRouter.delete("/api/matka/:id", matkaController.deleteMatka); 
matkaRouter.patch("/api/matka/:id/status", matkaController.changeMarketStatus);

module.exports = matkaRouter;
