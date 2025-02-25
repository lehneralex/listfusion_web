// einzelner User
export class User{
    firstname;
    lastname;
    email;
    password;
    birthdate;

    constructor(firstname, lastname, email, password, birthdate = null) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.birthdate = birthdate;
    }
}