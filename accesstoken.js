window.onload = () => {
	const supabaseUrl = "https://epcjufipobybxdmcqjgb.supabase.co";
	const supabaseKey =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwY2p1Zmlwb2J5YnhkbWNxamdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzIyMzU1MDksImV4cCI6MTk4NzgxMTUwOX0.MAZAUEozeDU7f6ZKwia0OMlJ8WnZFi-FCn-4cpAUCcE";
	const supabaseff = supabase.createClient(supabaseUrl, supabaseKey);

	supabaseff.auth.getSession().then((session) => {
		let token;

		if (session.data.session && session.data.session["access_token"]) {
			token = session.data.session["access_token"];
		} else {
			token = null;
		}

		chrome.storage.sync.set({ accesstoken: token }, function () {
			console.log("Access token has been set");
		});
	});
};
