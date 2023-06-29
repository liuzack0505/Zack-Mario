// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Camera extends cc.Component {

    @property(cc.Node)
    target: cc.Node = null;

    @property(cc.Camera)
    mainCamera: cc.Camera = null;

    @property
    minCameraX: number = -180;

    @property
    maxCameraX: number  = 1100;

    @property
    minCameraY: number  = 220;

    @property
    maxCameraY: number  = 430;

    update(dt: number) {
        if (this.target.isValid) {
            let x:number, y:number;
            const targetPosition = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
            //set the camera limit
            if (targetPosition.x < this.minCameraX) {
                x = this.minCameraX;
            } else if (this.maxCameraX < targetPosition.x) {
                x = this.maxCameraX;
            } else {
                x = targetPosition.x;
            }

            if (targetPosition.y < this.minCameraY) {
                y = this.minCameraY;
            } else if (this.maxCameraY < targetPosition.y) {
                y = this.maxCameraY;
            } else {
                y = targetPosition.y;
            }
            
            //calculate the camera pos
            const cameraPosition = this.node.parent.convertToNodeSpaceAR(new cc.Vec2(x, y));
            this.node.position = cc.v3(cameraPosition.x, cameraPosition.y, this.node.position.z);
        }
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
       
    // }

    // start () {
        
    // }

    // update (dt) {}
}
