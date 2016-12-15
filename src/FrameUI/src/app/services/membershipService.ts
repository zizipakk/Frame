import { Injectable } from '@angular/core';
import { API } from '../app.settings';
import { DataService } from './dataService';
import { Registration } from '../models/registration';
import { User } from '../models/user';

//A class to manage user authentication
//uses local storage to save user authentication cookies

@Injectable()
export class MembershipService {

    private action = '/account'
    private accountRegisterAPI = API.AUTH + this.action + '/register';
    private accountLoginAPI = API.AUTH + this.action + '/login';
    private accountLogoutAPI = API.AUTH + this.action + '/logout';
    
    constructor(private dataService: DataService) {
    }

    register(newUser: Registration) {
        this.dataService.set(this.accountRegisterAPI);
        return this.dataService.post(JSON.stringify(newUser));
    }

    login(creds: User) {
        this.dataService.set(this.accountLoginAPI);
        return this.dataService.post(JSON.stringify(creds));
    }

    logout() {
        this.dataService.set(this.accountLogoutAPI);
        return this.dataService.post(null, false);
    }

    isUserAuthenticated(): boolean {
        var user = localStorage.getItem('user');
        if (user != null)
            return true;
        else
            return false;
    }

    getLoggedInUser(): User {
        var user: User;

        if (this.isUserAuthenticated()) {
            var userData = JSON.parse(localStorage.getItem('user'));
            user = new User(userData.Username, userData.Password);
        }

        return user;
    }
}