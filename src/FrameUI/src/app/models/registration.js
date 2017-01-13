"use strict";
var Registration = (function () {
    function Registration(username, password, email) {
        this.Username = username;
        this.Password = password;
        this.Email = email;
    }
    return Registration;
}());
exports.Registration = Registration;
exports.TestArray = ([
    { Id: "name", Value: "Jack" },
    { Id: "desc", Value: "The Ripper" },
    { Id: "dist", Value: "10" }
]);
var TestName = exports.TestArray.filter(function (m) { return m.Id == 'name'; })[0].Value;
