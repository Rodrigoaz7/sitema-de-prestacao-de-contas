if(getCookie('MeuToken') == "")
{
	window.location.replace("gLogin.html");
}

var botaoLogout= document.querySelector("#logout");

botaoLogout.addEventListener("click",function(event){

	event.preventDefault()
	sessionStorage.clear();
	// Forma de deletar cookie e deslogar user
	createCookie('MeuToken', '', 0);
	//createCookie('crstoken','',0);
	window.location.replace("gLogin.html");
});