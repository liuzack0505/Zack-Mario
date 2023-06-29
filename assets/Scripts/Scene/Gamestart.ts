// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const {ccclass, property} = cc._decorator;

@ccclass
export default class Gamestart extends cc.Component {

    @property(cc.Animation)
    animation :cc.Animation = null;

    @property(cc.Label)
    lifeLabel: cc.Label = null;

    private userData;

    switchScene(stageName: string, userData) {
        cc.director.loadScene(stageName, ()=>{
            cc.director.emit('userData', userData);
        });
    }

    setLifeLabel(){
        this.lifeLabel.string = this.userData.life.toString().padStart(2, '0');
    }
    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //get the stage info and change the scene
        cc.director.on('levelData', (levelData: Number)=>{
            const stageName = 'stage_' + levelData.toString();
            this.animation.play();
            this.animation.on("finished", ()=>{
                this.switchScene(stageName, this.userData);
            });
        }, this);
        cc.director.on('userData', (userdata)=>{
            this.userData = userdata;
            this.setLifeLabel();
        }, this)
    }

    // start () {

    // }

    // update (dt) {}
}
