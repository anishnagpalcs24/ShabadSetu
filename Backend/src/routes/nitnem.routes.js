import { Router } from "express";
import nitnemController from "../controllers/nitnem.controller.js";

const router = Router();

router.get("/sundergutka", nitnemController.getSunderGutka);
router.get("/sundergutka/:id", nitnemController.getSunderGutkaById);
router.get("/bani", nitnemController.getBani);
router.get("/bani/:id", nitnemController.getBaniById);
router.get("/sundergutka/:sg_id/bani/:bani_id", nitnemController.getSunderGutkaBani);

export default router;
