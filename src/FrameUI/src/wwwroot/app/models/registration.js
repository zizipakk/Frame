export var Registration = (function () {
    function Registration(username, password, email) {
        this.Username = username;
        this.Password = password;
        this.Email = email;
    }
    return Registration;
}());
export var TestArray = ([
    { Id: "name", Value: "Jack" },
    { Id: "desc", Value: "The Ripper" },
    { Id: "dist", Value: "10" }
]);
var TestName = TestArray.filter(function (m) { return m.Id == 'name'; })[0].Value;
//# sourceMappingURL=C:/FRAME/Frame/src/FrameUI/src/app/models/registration.js.map