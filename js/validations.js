<!-- funcions de validació del formulari -->

function validateForm() {

    /* validem l'usuari */
    if (document.forms["registre"]["usuari"].value == "") {
        alert("el camp USUARI és incorrecte");
        return false;
    }

    /* validem la contrasenya */
    camp = document.forms["registre"]["contrasenya"];
    if (camp.value == "" || camp.length >= 8) {
        alert("el camp CONTRASENYA és incorrecte");
        return false;
    }

    /* validem que les contrsenyes coincideixin */
    if (document.forms["registre"]["contrasenya"].value != document.forms["registre"]["contrasenya2"].value) {
        alert("el camp CONTRASENYA2 és incorrecte");
    }

    /* validem el nom */
    if (document.forms["registre"]["nom"].value == "") {
        alert("el camp NOM és incorrecte");
        return false;
    }

    /* validem el primer cognom */
    if (document.forms["registre"]["cognom1"].value == "") {
        alert("el camp PRIMER COGNOM és incorrecte");
        return false;
    }

    /* validem el segon cognom */
    if (document.forms["registre"]["cognom2"].value == "") {
        alert("el camp SEGON COGNOM és incorrecte");
        return false;
    }

    /* validem la adreça */
    if (document.forms["registre"]["adreca"].value == "") {
        alert("el camp ADREÇA és incorrecte");
        return false;
    }

    /* validem la poblacio */
    if (document.forms["registre"]["poblacio"].value == "") {
        alert("el camp POBLACIO és incorrecte");
        return false;
    }

    /* validem el codi postal */
    camp = document.forms["registre"]["codiPostal"];
    if (camp.value == "" || camp.length > 5 || isFinite(camp.value) == false) {
        alert("el camp CODI POSTAL és incorrecte");
        return false;
    }

    /* validem el pais */
    if (document.forms["registre"]["pais"].value == "") {
        alert("el camp PAIS és incorrecte");
        return false;
    }

    /* validem el telefon */
    camp = document.forms["registre"]["telefon"];
    if (camp.value == "" || camp.length > 9 || isFinite(camp.value) == false) {
        alert("el camp TELEFON és incorrecte");
        return false;
    }

    /* validem el email */
    camp = document.forms["registre"]["email"];
    if (camp.value == "" || camp.value.includes("@") == false || camp.value.includes(".") == false) {
        alert("el camp EMAIL és incorrecte");
        return false;
    }

    /* validem el dni */
    camp = document.forms["registre"]["dni"];
    if (camp.value == "" || camp.length > 8) {
        alert("el camp DNI és incorrecte");
        return false;
    }

    /* validem el naixement */
    camp = document.forms["registre"]["naixement"];
    naix = new Date(camp.value);
    today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    if (camp.value == "" || naix.getTime() > today.getTime()) {
        alert("el camp NAIXEMENT és incorrecte");
        return false;
    }

    /* validem accepta condicions */
    if (document.forms["registre"]["condicions"].checked == false) {
        alert("el camp CONDICIONS és incorrecte");
        return false;
    }

    return true;
}

/* funció que crea l'objecte storage */
function userStorage() {
    this.users = new Array();

    this.addUser = function (user) {
        this.users.push(user);
    }
}

/* objecte user */
function user(usuari, contrasenya, nom, cognom1, cognom2, adreca, poblacio, codiPostal, pais, telefon, email, dni, naixement) {
    this.usuari = usuari;
    this.contrasenya = contrasenya;
    this.nom = nom;
    this.cognom1 = cognom1;
    this.cognom2 = cognom2;
    this.adreca = adreca;
    this.poblacio = poblacio;
    this.codiPostal = codiPostal;
    this.pais = pais;
    this.telefon = telefon;
    this.email = email;
    this.dni = dni;
    this.naixement = naixement;
    this.blocat = 0; /* es crea un nou usuari sense bloquejar */
    this.intents = 0; /* es crea un nou usuari amb 0 intents fallits de logueix, als tres es passa a bloquejat */
    this.loginFlag = 0; /* si loginFlag=0 => usuari no loguejat, si loguinFlag=1 => usuari loguejat */

    /* funció que bloqueja l'usuari */
    this.blockUser = function () {
        this.blocat = 1;
    }

    /* funció desbloqueig usuari */
    this.unblockUser = function () {
        this.blocat = 0;
    }

    /* funció increment intent */
    this.addIntent = function () {
        this.intents++;
        if (this.intents == 3) {
            this.blockUser();
        }
    }

    /* funció reset intents */
    this.resetIntent = function () {
        this.intents = 0;
    }
}

/* funció que crea l'objecte userStorage si no existeix al localStorage */
function createStorage() {
    var storage = localStorage.getItem("userStorage");
    if (storage == null) {
        us = new userStorage();
        localStorage.setItem("userStorage", JSON.stringify(us));
    }

}

function insertUser() {
    /* creem el userStorage si no existeix */
    createStorage();

    /* comprovem que el formulari sigui correcte */
    if (validateForm()) {

        /* creem un userStorage */
        var us = new userStorage();

        /* recuperem el localStorage i ho convertim a objecte */
        ls = JSON.parse(localStorage.getItem("userStorage"));

        /* afegim els users del localStorage al userStorage */
        for (i = 0; i < ls.users.length; i++) {
            us.addUser(new user(ls.users[i].usuari, ls.users[i].contrasenya, ls.users[i].nom, ls.users[i].cognom1, ls.users[i].cognom2, ls.users[i].adreca, ls.users[i].poblacio, ls.users[i].codiPostal, ls.users[i].pais, ls.users[i].telefon, ls.users[i].email, ls.users[i].dni, ls.users[i].naixement));
        }

        nom = document.forms["registre"]["nom"].value;
        cognom1 = document.forms["registre"]["cognom1"].value;
        cognom2 = document.forms["registre"]["cognom2"].value;
        dni = document.forms["registre"]["dni"].value;
        email = document.forms["registre"]["email"].value;

        for (i = 0; i < us.users.length; i++) {
            /* mirem si l'usuari ja existeix */
            if ((us.users[i].nom == nom && us.users[i].cognom1 == cognom1 && us.users[i].cognom2 == cognom2) || (us.users[i].dni == dni) || (us.users[i].email == email)) {
                alert("aquest nom d'usuari ja està en ús");
                return false;
            }
        }

        /* com que no existeix l'usuari, el donem d'alta al localStorage */
        usuari = document.forms["registre"]["usuari"].value;
        contrasenya = document.forms["registre"]["contrasenya"].value;

        adreca = document.forms["registre"]["adreca"].value;
        poblacio = document.forms["registre"]["poblacio"].value;
        codiPostal = document.forms["registre"]["codiPostal"].value;
        pais = document.forms["registre"]["pais"].value;
        telefon = document.forms["registre"]["telefon"].value;


        naixement = document.forms["registre"]["naixement"].value;

        /* afegim el nou usuari */
        us.addUser(new user(usuari, contrasenya, nom, cognom1, cognom2, adreca, poblacio, codiPostal, pais, telefon, email, dni, naixement));

        /* guardem l'objecte userStorage al localStorage com string */
        localStorage.setItem("userStorage", JSON.stringify(us));
        window.open("presentacio_producte.html", "_self");
    }
    return true;
}


<!-- funcions de validació del login -->

function loginUser() {

    /* creem el userStorage si no existeix */
    createStorage();

    /* recuperem el localStorage i ho convertim a objecte */
    ls = JSON.parse(localStorage.getItem("userStorage"));

    /* posem tots els loguinFlag a zero per si es loguejen dos usuaris seguits */
    for (i = 0; i < ls.users.length; i++) {
      ls.users[i].loginFlag = 0;
    }

    /* recorrem l'array d'usuaris i cerquem el que tingui el mateix nom d'usuari */
    for (i = 0; i < ls.users.length; i++) {

        /* si coincideix el nom d'usuari */
        if (ls.users[i].usuari == document.forms["login"]["usuari"].value) {

            /* si l'usuari NO està blocat */
            if (ls.users[i].blocat == 0) {

                /* si coincideix també la contrasenya */
                if (ls.users[i].contrasenya == document.forms["login"]["contrasenya"].value) {
                    ls.users[i].loginFlag = 1;
                    localStorage.setItem("userStorage", JSON.stringify(ls));
                    /* esborrem la el carrito del localStorage */
                    localStorage.removeItem("carrito");
                    alert("Benvingut " + ls.users[i].usuari + ", t'has loguejat correctament a la pàgina.");
                    window.open("presentacio_producte.html", "_self");
                    return true;
                }

                /* si coincideix el nom d'usuari però no la contrasenya */
                else {
                    ls.users[i].addIntent();
                    alert("La contrasenya introduida no es correspon a la del usuari");
                    return false;
                }
            }

            /* si l'usuari està blocat */
            else {
                alert("L'usuari està bloquejat, posa't en contacte amb l'administrador.")
                return false;
            }
        }
    }
    /* s'ha recorregut tot l'array d'usuaris i no s'ha trobat el que buscavem */
    alert("L'usuari introduit no esta donat d'alta.");
    return false;
}
