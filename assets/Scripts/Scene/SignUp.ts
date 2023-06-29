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
export default class SignUp extends cc.Component {

    @property(cc.EditBox)
    usernameEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    emailEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    passwordEditBox: cc.EditBox = null;

    @property(cc.Button)
    signUpBtn: cc.Button = null;

    @property(cc.Button)
    backBtn: cc.Button = null;

    private username: string;

    private email: string;
    
    private password: string;

    private error: boolean = false;

    switchBack(){
        cc.director.loadScene("Mainmenu");
    }

    switchScene(username: string, id: string) {
        cc.director.loadScene("LevelSelect", ()=>{
            cc.director.emit('userData', {
                id:id,
                username:username,
                life: 5, 
                coin: 0, 
                score: 0,
                stage: 0,
                challengeFinished: false  
            });
        });
    }

    clickSignUpBtn(){
        this.username = this.usernameEditBox.string.toUpperCase();
        this.email = this.emailEditBox.string;
        this.password = this.passwordEditBox.string;
        if (!this.username||!this.email||!this.password) {
            this.error = true;
            return;
        }
        this.signUp();
    }


    async signUp(){
        let userInfo = await firebase.auth().createUserWithEmailAndPassword(this.email, this.password);
        await firebase.database().ref(userInfo.user.uid).set({
            id:userInfo.user.uid,
            username:this.username,
            life: 5, 
            coin: 0, 
            score: 0,
            stage: 0,
            challengeFinished: false   
        }).then(()=>{
            this.switchScene(this.username, userInfo.user.uid);
        }).catch((e)=>{
            alert(e.message);
            this.error = true;
            console.log(e);
        })
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.signUpBtn.node.on('touchstart', this.clickSignUpBtn, this);
        this.backBtn.node.on('touchstart', this.switchBack, this);
    }

    // start () {
        
    // }

    // update (dt) {}
}
