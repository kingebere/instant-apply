const express = require("express");
const supabase = require("@supabase/supabase-js");
const dotenv = require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//API ROUTES
app.get("/getUser", async (req, res) => {
	let supabaseUrl = process.env.URL;
	let supabaseKey = process.env.KEY;

	let supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
	const token = req.headers["authorization"].split(" ")[1];

	const { data, error } = await supabaseClient.auth.getUser(token);

	if (data) {
		const { user } = data;
		console.log(token,data)
		const { data: dbdata, dberror } = await supabaseClient
			.from("profile")
			.select(
				"firstname, lastname,resume_email,resume_url,pdf,linkedin,github,website"
			)
			.eq("id", user.id);
		res.status(200).json({
			data: dbdata[0],
		});
	}
});

const port = 8000;
app.listen(port, () => {
	console.log("listening on port " + port);
});
