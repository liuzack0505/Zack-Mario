// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    stage_1: cc.Button = null;

    @property(cc.Button)
    stage_2: cc.Button = null;

    @property(cc.Label)
    coinLabel: cc.Label = null;

    @property(cc.Label)
    lifeLabel: cc.Label = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    usernameLabel: cc.Label = null;

    @property(cc.Label)
    neverLand: cc.Label = null;

    private userData;

    switchScene(levelData: number, userData) {
        cc.director.loadScene("Gamestart", () => {
            cc.director.emit('levelData', levelData);
            cc.director.emit('userData', userData);
        });
    }

    setallLabel(){
        this.scoreLabel.string = this.userData.score.toString().padStart(8, '0');
        this.coinLabel.string = this.userData.coin.toString().padStart(2, '0');
        this.lifeLabel.string = this.userData.life.toString().padStart(2, '0');
        this.usernameLabel.string = this.userData.username;
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.stage_1.node.on('touchstart', ()=>{
            this.switchScene(1, this.userData)
        }, this)

        this.stage_2.node.on('touchstart', ()=>{
            if (this.stage_2.interactable) {
                this.switchScene(2, this.userData)
            }
        }, this)

        cc.director.on('userData', (userData)=>{
            console.log(userData);
            this.userData = userData;
        }, this)
    }

    start () {
        this.setallLabel()
        if (this.userData.stage < 1) {
            this.stage_2.interactable = false;
        }
        if (this.userData.challengeFinished) {
            this.neverLand.node.opacity = 255;
        } else {
            this.neverLand.node.opacity = 0;
        }
    }

    // }

    // update (dt) {}
}
