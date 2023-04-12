// chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
// 	// 2. A page requested user data, respond with a copy of `user`
// 	if (message === "fetchuser") {
// 		fetch("http://localhost:8000/getUser")
// 			.then((response) => response.json())
//             .then(async(responseData) => {
//                 console.log(responseData)
//                 await sendResponse('hey')
//             });
// 	}
// });
