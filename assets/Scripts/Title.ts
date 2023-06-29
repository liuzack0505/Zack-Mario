// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Title extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property
    minScale: number = 0.9;

    @property
    maxScale: number = 1.1;

    @property
    duration: number = 2;

    startAnimation() {
        const scaleDown = cc.scaleTo(this.duration, this.minScale);
        const scaleUp = cc.scaleTo(this.duration, this.maxScale);
        const sequence = cc.sequence(scaleDown, scaleUp);
        const repeat = cc.repeatForever(sequence);

        this.node.runAction(repeat);
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.startAnimation();
    }



    // update (dt) {}
}
