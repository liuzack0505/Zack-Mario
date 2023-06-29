// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import type firebase from '../firebase';
declare const firebase: any;

@ccclass
export default class LogIn extends cc.Component {

    @property(cc.EditBox)
    emailEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    passwordEditBox: cc.EditBox = null;

    @property(cc.Button)
    loginBtn: cc.Button = null;

    @property(cc.Button)
    backBtn: cc.Button = null;

    private email: string;
    
    private password: string;

    private error: boolean = false;

    private userData;

    switchBack(){
        cc.director.loadScene("Mainmenu");
    }

    switchScene(userData) {
        cc.director.loadScene("LevelSelect", ()=>{
            cc.director.emit('userData', userData);
        });
    }
    clickLoginInBtn(){
        this.email = this.emailEditBox.string;
        this.password = this.passwordEditBox.string;
        if (!this.email||!this.password) {
            this.error = true;
            return;
        }
        this.logIn();
    }

    async logIn(){
        let userInfo = await firebase.auth().signInWithEmailAndPassword(this.email, this.password);
        await firebase.database().ref(userInfo.user.uid).once('value', (snapshot)=>{
            this.userData = snapshot.val();
        }).then(()=>{
            this.switchScene(this.userData);
        }).catch((e)=>{
            this.error = true;
            alert(e.message);
            console.log(e);
        })
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.loginBtn.node.on('touchstart', this.clickLoginInBtn, this);
        this.backBtn.node.on('touchstart', this.switchBack, this);
    }

    // start () {

    // }

    // update (dt) {}
}
