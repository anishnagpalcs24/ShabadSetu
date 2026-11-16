import { Router } from "express";
import searchController from "../controllers/search.controller.js";
import { validate } from "../middleware/validate.js";
import { validateSearchParams, validateSearchQuery } from "../validators/search.validator.js";

const router = Router();

router.get(
  "/:query",
  validate({ params: validateSearchParams, query: validateSearchQuery }),
  searchController.search
);

export default router;
