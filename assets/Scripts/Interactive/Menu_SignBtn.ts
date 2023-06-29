// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MenuSignBtn extends cc.Component {

    @property(cc.Button)
    button: cc.Button = null;

    switchScene() {
        cc.director.loadScene("SignIn");
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.button.node.on('touchstart', this.switchScene, this);
    }

    // start () {

    // }

    // update (dt) {}
}
