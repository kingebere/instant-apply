window.onload = () => {
	const supabaseUrl = urlsupa;
	const supabaseKey = keysupa;
	const supabaseff = supabase.createClient(supabaseUrl, supabaseKey);

	supabaseff.auth.getSession().then((session) => {
		let token;

		//token
		if (session.data.session && session.data.session["access_token"]) {
			token = session.data.session["access_token"];
		} else {
			token = null;
		}

		chrome.storage.sync.set({ session: JSON.stringify(session) }, function () {
			console.log("session has been set");
		});
	});
};
