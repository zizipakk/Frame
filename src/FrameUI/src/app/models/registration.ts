export class Registration {
    Username: string;
    Password: string;
    Email: string;

    constructor(username: string,
        password: string,
        email: string) {
        this.Username = username;
        this.Password = password;
        this.Email = email;
    }
}

export const TestArray = ([
    { Id: "name", Value: "Jack" },
    { Id: "desc", Value: "The Ripper" },
    { Id: "dist", Value: "10" }
]);
let TestName = TestArray.filter(m => m.Id == 'name')[0].Value;