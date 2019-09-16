const auth = firebase.auth(),
    db = firebase.firestore();
var usuario;

document.body.setAttribute("hidden","");

auth.onAuthStateChanged(user=>{
    let menuUsuario = document.querySelector(".dropdown-toggle");
    if (user) {
        db.collection("usuarios").doc(user.uid).get().then(doc=>{
            usuario = doc.data();
            menuUsuario.innerHTML = usuario.nome.split(" ")[0];
            //logout
            document.getElementById("linkLogout").addEventListener("click", e=>{
                e.preventDefault();
                auth.signOut();
            });
            document.body.removeAttribute("hidden");
        });
    } else{
        usuario = undefined;
        location.href = "login.html";
    }
});

/*TODOs
    auth.createUserWithEmailAndPassword(email, senha);
*/