import {fabric} from 'fabric';
import {Command} from './command';
import {Data} from '../data';


export class VertexCommand implements Command{
  canvas:any;
  circle: any;
  text:any;
  group:any;
  vertexJS:any;
  id:number;

  constructor(c,meno){
    this.id=meno;
    this.vertexJS = { "type":"vertex", "id":meno.toString()};
    this.canvas=c;
    this.circle = new fabric.Circle({
      radius:30,
      fill:'red',
      top:100,
      left:100,
      stroke:"black",
      name:meno.toString(),
      strokeWidth:5,

    });

    this.circle.set("zakladnaFarba","red");
    this.text=new fabric.Text(meno.toString(), {left: this.circle.left+22,
                                            top: this.circle.top+7,
                                            fill:"transparent"
    });
    if(this.id/10 >=1){
      console.log(this.id/10);
      this.text.set("left",this.circle.left+12);
    }




    this.group = new fabric.Group([ this.circle, this.text ], {
      left: 100,
      top: 100,
      name:meno.toString(),
    });

    this.group.lockScalingX=true;
    this.group.lockScalingY=true;
    this.group.lockRotation=true;

    //custom atributy pre group
    this.group.set('type', 'vertex');
    this.group.set("pocetHran",0);
    this.group.set("reprezentaciaJS",this.vertexJS);
    this.group.set("farbaSpojenia","#B31B00");
    this.group.set("zakladnaFarba","red");
    this.group.set("aktualnaFarba","red");


  }





  execute() {
    this.canvas.add(this.group);
    this.canvas.moveTo(this.group, 100);
    Data.vertices_in_graph.push(this.id.toString());

  }

  unexecute() {
    this.canvas.remove(this.group);

    let index = Data.vertices_in_graph.indexOf(this.id);
    Data.vertices_in_graph.splice(index,1);

  }


}

