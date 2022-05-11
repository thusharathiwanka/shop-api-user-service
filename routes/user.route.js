const router = require("express").Router();
const {
	deleteUser,
	updateUser,
	getUser,
	getUsers,
	getUsersTotal,
	loginUser,
	saveUser,
} = require("../controllers/user.controller");

router.get("/", getUsers);
router.post("/", saveUser);
router.post("/login", loginUser);
router.get("/total", getUsersTotal);
router.put("/:id", updateUser);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);

module.exports = router;
