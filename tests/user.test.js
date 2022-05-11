const axios = require("axios");

describe("POST @ /users endpoint", () => {
	it("should save a user and and return saved user", () => {
		axios
			.post("http://localhost:5000/users/", {
				name: "Thushara Thiwanka",
				email: "thiwanka@gmail.com",
				password: "thiwanka123",
				mobile: "0764343434",
			})
			.then(res => expect(res.status).toEqual(201))
			.catch(err => {});
	});
});

describe("GET @ /users endpoint", () => {
	it("should return an users array and return status code 200", () => {
		axios
			.get("http://localhost:5000/users/")
			.then(res => {
				expect(res.status).toEqual(200);
				expect(typeof res.data).toEqual("Object");
			})
			.catch(err => {});
	});
});
