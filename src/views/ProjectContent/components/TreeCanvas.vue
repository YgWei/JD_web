<template>
  <div id="drawArea"></div>
</template>

<script>
import * as PIXI from "pixi.js";
import * as addWheelListener from "@/util/addWheelListener";

export default {
  name: "TreeCanvas",
  props: {
    msg: String
  },
  mounted() {
    if (!this.treeData) {
      this.treeData = {};
      this.treeData.nodeWidth = 50;
      this.treeData.nodeHeight = 50;
      this.treeData.nodeScaleDownFactor = 0.7;
      this.treeData.nodePadding = {
        x: 3,
        y: this.treeData.nodeHeight * 2
      };
      this.treeData.initDepth = 5;
      this.treeData.childrenPerNode = 3;
      this.treeData.nodeConfig = {
        activeColor: 0xf7f76a,
        inActiveColor: 0x555555
      };

      this.treeData.positionGridHash = {};
      this.treeData.treeYSpacing = this.treeData.nodeWidth * 3;
      this.treeData.tree = {};
      this.treeData.nodeArray = [];
      this.treeData.nodeStackArray = [];
      this.treeData.tree = this.initTree({}, 1);
      this.globalCount = 0;
      this.initDraw();
      this.$el.appendChild(this.treeData.drawApp.view);
      this.drawStuff();
      // this.animate();

      console.time("recurseTest");
      for (let x = 0; x < 100000; x++) {
        this.recurseTest(null, this.treeData.tree, 1);
      }
      console.timeEnd("recurseTest");

      console.time("stackTest");
      for (let x = 0; x < 100000; x++) {
        this.stackTest();
      }
      console.timeEnd("stackTest");
    }
  },
  methods: {
    animate() {
      if (this.animateTree()) {
        this.renderConnections();
        requestAnimationFrame(this.animate);
      } else {
        this.renderConnections();
      }
    },
    initDraw() {
      this.treeData.drawApp = new PIXI.Application({
        width: this.$el.clientWidth - 38,
        height: window.innerHeight,
        antialias: true
      });

      this.treeData.nodeLayer = new PIXI.Container();
      this.treeData.connectionLayer = new PIXI.Container();

      this.treeData.drawApp.stage.addChild(this.treeData.connectionLayer);
      this.treeData.drawApp.stage.addChild(this.treeData.nodeLayer);

      // set default scale
      this.treeData.drawApp.stage.scale.x = 1;
      this.treeData.drawApp.stage.scale.y = 1;

      this.treeData.drawApp.renderer.backgroundColor = 0xffffff;

      const gr = new PIXI.Graphics();
      gr.beginFill(0xffffff, 1);
      gr.drawRoundedRect(
        0,
        0,
        this.treeData.nodeWidth,
        this.treeData.nodeHeight,
        0
      );
      gr.endFill();
      this.treeData.nodeTexture = this.treeData.drawApp.renderer.generateTexture(
        gr
      );

      let draggingNode;
      this.treeData.drawApp.renderer.plugins.interaction.on(
        "mousedown",
        event => {
          const foundNode = this.findMouseOverSprite(event.data.global);
          if (foundNode) {
            draggingNode = foundNode;
            draggingNode.nodeSpriteRef.tint = this.treeData.nodeConfig.activeColor;
            draggingNode.isDragging = true;
          } else {
            this.drawStuff();
          }
        }
      );

      let nearestNode;
      this.treeData.drawApp.renderer.plugins.interaction.on(
        "mousemove",
        event => {
          if (draggingNode) {
            draggingNode.targetPosition.x = event.data.global.x;
            draggingNode.targetPosition.y = event.data.global.y;
            draggingNode.nodeSpriteRef.position.x = event.data.global.x;
            draggingNode.nodeSpriteRef.position.y = event.data.global.y;

            const newNearestNode = this.findNearestNode(draggingNode, true);

            if (newNearestNode && newNearestNode !== nearestNode) {
              // console.log(newNearestNode);
              nearestNode = newNearestNode;
              this.attachChildToParent(draggingNode, nearestNode);
              console.time("initNodeStackArray");
              this.initNodeStackArray(null, this.treeData.tree, 1);
              console.timeEnd("initNodeStackArray");
            }

            this.drawStuff(draggingNode);

            // this.drawStuff(this.treeData.tree, true);
            // console.log('Draggging', dragginNode);
          }
        }
      );

      this.treeData.drawApp.renderer.plugins.interaction.on("mouse", () => {
        if (draggingNode) {
          const nearest = this.findNearestNode(draggingNode, true);

          if (nearest) {
            this.attachChildToParent(draggingNode, nearest);
          }
          draggingNode.nodeSpriteRef.tint = this.treeData.nodeConfig.inActiveColor;
          draggingNode.isDragging = false;
          draggingNode = null;
          this.drawStuff(this.treeData.tree);
        }
      });

      this.treeData.drawApp.renderer.plugins.interaction.on("mouseup", () => {
        if (draggingNode) {
          const nearest = this.findNearestNode(draggingNode, true);

          if (nearest) {
            this.attachChildToParent(draggingNode, nearest);
          }
          draggingNode.nodeSpriteRef.tint = this.treeData.nodeConfig.inActiveColor;
          draggingNode.isDragging = false;
          draggingNode = null;
          this.drawStuff(this.treeData.tree);
        }
      });

      addWheelListener(this.treeData.drawApp.view, e => {
        this.zoom(e.clientX, e.clientY, e.deltaY < 0);
        e.preventDefault();
      });

      const gr2 = new PIXI.Graphics();
      gr2.position.set(0, 0);
      gr2.lineStyle(1, 0x999999);
      gr2.moveTo(0, 0);
      gr2.lineTo(1000, 0);
      this.treeData.lineTexture = this.treeData.drawApp.renderer.generateTexture(
        gr2
      );
    },
    zoom(x, y, z) {
      console.log(x, y, z);
    },
    drawStuff(startNode = null, onlyConnections = false) {
      this.globalNodeCount = 0;
      this.calcBaseTreeWidth(this.treeData.tree, 1);
      this.treeData.positionGridHash = {};

      const treeNode = startNode || this.treeData.tree; // default to the top tree node if no startNode is sent in
      console.time("render");
      const startOffset =
        this.treeData.drawApp.renderer.width / 2 - treeNode.footprintWidth / 2;
      this.renderTree(null, treeNode, 1, startOffset, onlyConnections);
      console.timeEnd("render");

      if (!treeNode.parent && !onlyConnections) {
        console.time("initNodeStackArray");
        this.treeData.nodeStackArray = [];
        this.initNodeStackArray(null, this.treeData.tree, 1);
        console.timeEnd("initNodeStackArray");
      }

      this.animate();
    },
    renderTree(parent, treeNode, depth, offsetX, onlyConnections) {
      this.globalNodeCount += 1;

      if (!treeNode.nodeSpriteRef && !onlyConnections) {
        treeNode.nodeSpriteRef = new PIXI.Sprite(this.treeData.nodeTexture);
        treeNode.nodeSpriteRef.tint = 0x555555; // set default tint
        treeNode.nodeSpriteRef.anchor.set(0.5);

        treeNode.topAttachPointOffsetX = 0;
        treeNode.topAttachPointOffsetY = 0; // -1 + -this.treeData.nodeHeight / 2;
        treeNode.bottomAttachPointOffsetX = 0;
        treeNode.bottomAttachPointOffsetY = 0; // 1 + this.treeData.nodeHeight / 2;

        treeNode.targetPosition = {
          x: 0,
          y: 0
        };

        this.treeData.nodeLayer.addChild(treeNode.nodeSpriteRef);
      }

      if (!treeNode.isDragging && !onlyConnections) {
        const xPos = offsetX + treeNode.footprintWidth / 2;
        let yPos;
        if (parent) {
          yPos =
            parent.targetPosition.y +
            parent.calcHeight / 2 +
            parent.calcHeight * 2;
        } else {
          yPos = this.treeData.nodePadding.y;
        }

        treeNode.targetPosition.x = xPos;
        treeNode.targetPosition.y = yPos;

        // treeNode.nodeSpriteRef.position (xPos, yPos);
      }

      treeNode.nodeSpriteRef.width = treeNode.calcWidth;
      treeNode.nodeSpriteRef.height = treeNode.calcHeight;

      if (treeNode.children.length > 0) {
        treeNode.children.reduce((offsetTotal, child) => {
          // console.log(treeNode, child, depth + 1, offsetTotal);
          this.renderTree(
            treeNode,
            child,
            depth + 1,
            offsetTotal +
              treeNode.targetPosition.x -
              treeNode.footprintWidth / 2,
            onlyConnections
          );
          return offsetTotal + child.footprintWidth; // + child.footprintWidth;
        }, 0);
      }
    },
    animateTree() {
      console.log("animateTree");
      this.globalNodeCount += 1;
      let stillGoing = false;
      for (let x = 0; x < this.treeData.nodeStackArray.length; x++) {
        const curNode = this.treeData.nodeStackArray[x].treeNode;
        let newX = curNode.targetPosition.x;
        let newY = curNode.targetPosition.y;
        if (curNode.targetPosition.x !== curNode.nodeSpriteRef.position.x) {
          if (
            Math.abs(
              curNode.targetPosition.x - curNode.nodeSpriteRef.position.x
            ) > 1
          ) {
            newX =
              curNode.nodeSpriteRef.position.x +
              (curNode.targetPosition.x - curNode.nodeSpriteRef.position.x) /
                10;
          }
          stillGoing = true;
        }
        if (curNode.targetPosition.y !== curNode.nodeSpriteRef.position.y) {
          if (
            Math.abs(
              curNode.targetPosition.y - curNode.nodeSpriteRef.position.y
            ) > 1
          ) {
            newY =
              curNode.nodeSpriteRef.position.y +
              (curNode.targetPosition.y - curNode.nodeSpriteRef.position.y) /
                10;
          }
          stillGoing = true;
        }

        if (stillGoing) {
          // console.log(newX, newY);
          curNode.nodeSpriteRef.position.set(newX, newY);
        }
      }
      return stillGoing;
    },
    initNodeStackArray(parent, treeNode, depth) {
      const stackItem = { treeNode };

      stackItem.startIndex = this.treeData.nodeStackArray.length;
      stackItem.endIndex = 0;
      stackItem.depth = depth;
      treeNode.nodeStackIndex = this.treeData.nodeStackArray.length; // save the location/index of this elements position in the nodeStackArray
      this.treeData.nodeStackArray.push(stackItem);

      if (treeNode.children.length > 0) {
        for (let x = 0; x < treeNode.children.length; x++) {
          this.initNodeStackArray(treeNode, treeNode.children[x], depth + 1);
        }
      }

      stackItem.endIndex = this.treeData.nodeStackArray.length - 1;
    },
    recurseTest(parent, treeNode, depth) {
      if (treeNode.children.length > 0) {
        treeNode.children.forEach(child => {
          this.recurseTest(treeNode, child, depth + 1);
        });
      }
    },
    stackTest() {
      const parentStack = [];
      let curParent = null;
      let lastDepth = 1;

      const nStack = this.treeData.nodeStackArray;

      for (let x = 0; x < nStack.length; x++) {
        if (nStack[x].depth > lastDepth) {
          parentStack[nStack[x - 1].depth - 1] = curParent;
          // set null for curParent if we are on the first element
          curParent = x > 0 ? nStack[x - 1] : null;
        } else if (nStack[x].depth < lastDepth) {
          curParent = parentStack[nStack[x].depth - 1];
        }

        lastDepth = nStack[x].depth;
        // console.log(nStack[x]);
      }
    },

    renderConnections() {
      const parentStack = [];
      let curParent = null;
      let lastDepth = 1;

      const nStack = this.treeData.nodeStackArray;

      for (let x = 0; x < nStack.length; x++) {
        if (nStack[x].depth > lastDepth) {
          parentStack[nStack[x - 1].depth - 1] = curParent;
          // set null for curParent if we are on the first element
          curParent = x > 0 ? nStack[x - 1] : null;
        } else if (nStack[x].depth < lastDepth) {
          curParent = parentStack[nStack[x].depth - 1];
        }

        lastDepth = nStack[x].depth;
        const curParentTreeNode = curParent ? curParent.treeNode : null;

        if (curParentTreeNode !== null) {
          if (!nStack[x].treeNode.lineSpriteRef) {
            nStack[x].treeNode.lineSpriteRef = new PIXI.Sprite(
              this.treeData.lineTexture
            );
            this.treeData.connectionLayer.addChild(
              nStack[x].treeNode.lineSpriteRef
            );
          }

          const px =
            curParentTreeNode.nodeSpriteRef.position.x +
            curParentTreeNode.bottomAttachPointOffsetX;
          const py =
            curParentTreeNode.nodeSpriteRef.position.y +
            curParentTreeNode.bottomAttachPointOffsetY;
          const nx =
            nStack[x].treeNode.nodeSpriteRef.position.x +
            nStack[x].treeNode.topAttachPointOffsetX;
          const ny =
            nStack[x].treeNode.nodeSpriteRef.position.y +
            nStack[x].treeNode.topAttachPointOffsetY;
          const tmpCalc = (px - nx) ** 2 + (py - ny) ** 2;

          nStack[x].treeNode.lineSpriteRef.width = Math.sqrt(tmpCalc);
          nStack[x].treeNode.lineSpriteRef.position.set(nx, ny);
          nStack[x].treeNode.lineSpriteRef.rotation =
            -1 * Math.atan((px - nx) / (py - ny)) - Math.PI / 2;

          if (py > ny) {
            nStack[x].treeNode.lineSpriteRef.rotation += Math.PI;
          }
        }

        // console.log(nStack[x]);
      }
    },
    calcBaseTreeWidth(treeNode, depth) {
      treeNode.calcWidth =
        this.treeData.nodeWidth *
        this.treeData.nodeScaleDownFactor ** (depth - 1);
      treeNode.calcHeight =
        this.treeData.nodeHeight *
        this.treeData.nodeScaleDownFactor ** (depth - 1);

      // if parent only has 1 child carry forward the footprintWidthMin from the parent.
      if (treeNode.parent && treeNode.parent.children.length < 2) {
        treeNode.footprintWidthMin = treeNode.parent.footprintWidthMin;
      } else {
        treeNode.footprintWidthMin =
          this.treeData.nodePadding.x + treeNode.calcWidth;
      }

      if (treeNode.children.length > 0) {
        treeNode.footprintWidth = treeNode.children.reduce(
          (width, child) => width + this.calcBaseTreeWidth(child, depth + 1),
          0
        );
      } else {
        treeNode.footprintWidth = treeNode.footprintWidthMin;
      }

      // return the largest of the current nodes width and padding or the width of the entire sub-tree, whichever is greater.
      treeNode.footprintWidth = Math.max(
        treeNode.footprintWidth,
        treeNode.footprintWidthMin
      );

      return treeNode.footprintWidth;
    },
    initTree(parent, depth) {
      parent.children = [];
      // build flat node array for quicker operations
      this.treeData.nodeArray.push(parent);

      // --- Fill out the hash based position grid
      // const curGridX = Math.floor(treeNode.nodeSpriteRef.position.x / 10000) * 100;
      // const curGridY = Math.floor(treeNode.nodeSpriteRef.position.y / 10000) * 100;
      //
      // if (!this.treeData.positionGridHash[curGridX]) {
      //   this.treeData.positionGridHash[curGridX] = {};
      // }
      // if (!this.treeData.positionGridHash[curGridX][curGridY]) {
      //   this.treeData.positionGridHash[curGridX][curGridY] = [];
      // }
      // this.treeData.positionGridHash[curGridX][curGridY].push(treeNode);
      // ---------------------------------------------

      if (depth < this.treeData.initDepth) {
        const limit = this.treeData.childrenPerNode;
        for (let x = 0; x < limit; x++) {
          const newChild = this.initTree({}, depth + 1);
          newChild.parent = parent;
          parent.children.push(newChild);
        }
      }
      return parent;
    },
    findMouseOverSprite(hitPoint) {
      // const curGridX = Math.floor(hitPoint.x / 100) * 100;
      // const curGridY = Math.floor(hitPoint.y / 100) * 100;

      // let ary;
      // if (this.treeData.positionGridHash[curGridX] && this.treeData.positionGridHash[curGridX][curGridY]) {
      //   ary = this.treeData.positionGridHash[curGridX][curGridY];
      // }

      const ary = this.treeData.nodeArray;

      let foundNode = null;
      if (ary) {
        for (let x = 0; x < ary.length; x++) {
          const spritePosition = ary[x].nodeSpriteRef.position;
          const sprite = ary[x].nodeSpriteRef;
          if (
            hitPoint.x >= spritePosition.x - sprite.width / 2 &&
            hitPoint.x <= spritePosition.x + sprite.width / 2 &&
            hitPoint.y >= spritePosition.y - sprite.height / 2 &&
            hitPoint.y <= spritePosition.y + sprite.height / 2
          ) {
            foundNode = ary[x];
            console.log(foundNode.footprintWidthMin, foundNode.footprintWidth);
          }
        }
      }

      return foundNode;
    },
    isChildNode(node, childCheckNode) {
      for (let x = 0; x < node.children.length; x++) {
        if (node.children[x] === childCheckNode) return true;
      }
      return false;
    },
    findNearestNode(node, exludeChildren) {
      // const curGridX = Math.floor(node.nodeSpriteRef.position.x / 100) * 100;
      // const curGridY = Math.floor(node.nodeSpriteRef.position.y / 100) * 100;

      // let ary;
      // if (this.treeData.positionGridHash[curGridX] && this.treeData.positionGridHash[curGridX][curGridY]) {
      //   ary = this.treeData.positionGridHash[curGridX][curGridY];
      // }

      const ary = this.treeData.nodeArray;

      let closestNode;

      if (ary) {
        let minDist = Number.MAX_VALUE;

        for (let x = 0; x < ary.length; x++) {
          const spritePosition = ary[x].nodeSpriteRef.position;

          const px = spritePosition.x;
          const py = spritePosition.y;
          const nx = node.nodeSpriteRef.position.x;
          const ny = node.nodeSpriteRef.position.y;

          // don't consider any nodes below "node"(parameter)
          // this is more natural to how you would build a tree, and solves finding a nearest node that is in
          // the node's subtree when dragging (which disconnection to the main tree and  infinite recursion)
          if (ny > py + 15) {
            // a small padding to make it feel more natural before attaching to parent
            const dist = Math.sqrt((px - nx) ** 2 + (py - ny) ** 2);

            if (
              node !== ary[x] &&
              dist < minDist &&
              (!exludeChildren || !this.isChildNode(node, ary[x]))
            ) {
              minDist = dist;
              closestNode = ary[x];
            }
          }
        }
      }

      return closestNode;
    },
    attachChildToParent(child, newParent) {
      this.detachFromParent(child);
      newParent.children.push(child);

      newParent.children.sort(
        (a, b) => a.nodeSpriteRef.position.x - b.nodeSpriteRef.position.x
      );

      child.parent = newParent;
    },
    detachFromParent(node) {
      for (let x = 0; x < node.parent.children.length; x++) {
        if (node.parent.children[x] === node) {
          node.parent.children.splice(x, 1);
        }
      }

      node.parent = null;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div#drawArea {
  border: 1px dotted black;
}
</style>
