import { Router } from "express";
import gurbaniController from "../controllers/gurbani.controller.js";
import { optionalAuthenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { validateAngParams, validateIdParam } from "../validators/gurbani.validator.js";

const router = Router();

// Hukamnama endpoints (must precede dynamic /:page routes)
router.get("/hukamnama/today", gurbaniController.getHukamnamaToday);
router.get("/hukamnama/:year/:month/:day", gurbaniController.getHukamnamaByDate);

// Ang Reader endpoints
router.get(
  "/ang/:page",
  optionalAuthenticate,
  validate({ params: validateAngParams }),
  gurbaniController.getAng
);

router.get(
  "/ang/:page/:source",
  optionalAuthenticate,
  validate({ params: validateAngParams }),
  gurbaniController.getAng
);

// Backward compatibility with previous iGranth route
router.get(
  "/ang/:page/g/:source",
  optionalAuthenticate,
  validate({ params: validateAngParams }),
  gurbaniController.getAng
);

// Shabad & Line endpoints
router.get(
  "/shabad/:id",
  optionalAuthenticate,
  validate({ params: validateIdParam }),
  gurbaniController.getShabad
);

router.get(
  "/line/:id",
  validate({ params: validateIdParam }),
  gurbaniController.getLine
);

export default router;
