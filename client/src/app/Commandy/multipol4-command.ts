import {Command} from './command';
import {fabric} from 'fabric';
import {Data} from '../data';

export class Multipol4Command implements Command{
  group:any;
  fake1:any;
  fake2:any;
  fake3:any;
  fake4:any;
  multipol:any;
  array:any;
  first_time:boolean;
  id:number;
  multipolJS:any;




  constructor(id,name1,name2,name3,name4,type){
    this.multipolJS={
      "name":type,
      "id":id.toString(),


    };
    this.id = id;
    this.first_time=true;
    this.array = new Array();

    this.create_center_of_multipol(id,type);
    this.create_dangling_edges(name1,name2,name3,name4);
    this.create_multipol_object();
    this.add_doubleclick_to_static_multipol();
    this.add_doubleclick_to_moveable_multipol();
    this.add_objects_to_global_array();
  }

  create_multipol_object(){
    this.group = new fabric.Group();
    this.group.addWithUpdate(this.multipol);
    this.group.addWithUpdate(this.fake1);
    this.group.addWithUpdate(this.fake2);
    this.group.addWithUpdate(this.fake3);
    this.group.addWithUpdate(this.fake4);
    this.group.set("type","multipol4");
    this.group.set("name",this.id);
    this.group.lockScalingX=true;
    this.group.lockScalingY=true;
    this.group.lockRotation=true;
    this.group.set("farbaSpojenia","#E6BF00");
    this.group.set("zakladnaFarba","#FFFF19");
    this.multipol.set("suradnicaLeft",this.group.left);
    this.multipol.set("suradnicaTop",this.group.top);

  }

  add_doubleclick_to_moveable_multipol(){
    this.group.on("mousedblclick",function(){
      const lave = this.left;
      const horne = this.top;

      for(let i=0;i<5;i++){
        this.item(i).set("suradnicaLeft",lave);
        this.item(i).set("suradnicaTop",horne);
        Data.canvas.add(this.item(i));
      }
      this.item(0).item(0).set("fill",this.farbaSpojenia);
      Data.name_of_active_object.set("fill","transparent");   //iba mensia uprava, lebo obcas to bolo viditelne aj ked namalo byt
      Data.canvas.remove(this);
      Data.canvas.renderAll();
    });
  }
  add_doubleclick_to_static_multipol(){
    this.multipol.on("mousedblclick",function(options){

      for(let i=0; i<Data.array_of_multipoles_objects[this.name].length-1; i++){
        Data.canvas.remove(Data.array_of_multipoles_objects[this.name][i]);
      }

      Data.array_of_multipoles_objects[this.name][5].set("left",this.suradnicaLeft);
      Data.array_of_multipoles_objects[this.name][5].set("top",this.suradnicaTop);
      this.item(0).set("fill",Data.array_of_multipoles_objects[this.name][5].zakladnaFarba);
      Data.canvas.add(Data.array_of_multipoles_objects[this.name][5]);

      Data.canvas.remove(Data.label);
      Data.canvas.renderAll();


    });


  }
  create_dangling_edges(fake1name,fake2name,fake3name,fake4name){
    this.fake1 = new fabric.Circle({
      radius:30,
      fill:"pink",
      top:130,
      stroke:"black",
      left:122,
      strokeWidth:5,
      name:fake1name
    });

    this.fake2 = new fabric.Circle({
      radius:30,
      fill:"pink",
      top:222,
      stroke:"black",
      left:30,
      strokeWidth:5,
      name:fake2name
    });
    this.fake3 = new fabric.Circle({
      radius:30,
      fill:"pink",
      top:310,
      stroke:"black",
      left:122,
      strokeWidth:5,
      name:fake3name
    });
    this.fake4 = new fabric.Circle({
      radius:30,
      fill:"pink",
      top:222,
      stroke:"black",
      left:210,
      strokeWidth:5,
      name:fake4name
    });

    let fake1JS = {"type":"multipol","id":this.id.toString(),"dangling_edge":this.fake1.name};
    let fake2JS = {"type":"multipol","id":this.id.toString(),"dangling_edge":this.fake2.name};
    let fake3JS = {"type":"multipol","id":this.id.toString(),"dangling_edge":this.fake3.name};
    let fake4JS = {"type":"multipol","id":this.id.toString(),"dangling_edge":this.fake4.name};


    this.fake1.set("reprezentaciaJS",fake1JS);
    this.fake2.set("reprezentaciaJS",fake2JS);
    this.fake3.set("reprezentaciaJS",fake3JS);
    this.fake4.set("reprezentaciaJS",fake4JS);

  }

  create_center_of_multipol(id,type){
    let circle = new fabric.Circle({
      radius:50,
      fill:'#FFFF19',
      top:200,
      left:100,
      stroke:"black",
      strokeWidth:5,
    });

    let text=new fabric.Text(id.toString(), {left: circle.left+42,
      top: circle.top+27,
      fill:"transparent"
    });
    if(this.id/10 >=1){
      text.set("left",circle.left+32);
    }

    this.multipol = new fabric.Group();
    this.multipol.addWithUpdate(circle);
    this.multipol.addWithUpdate(text);
    this.multipol.set("type","multipol");
    this.multipol.set("vypis",type);
    this.multipol.set("left",100);
    this.multipol.set("top",200);
    this.multipol.set("name",this.id); // tu mozno radse id.toString()
    this.multipol.lockMovementX=true;
    this.multipol.lockMovementY=true;

  }
  add_objects_to_global_array(){
    this.array[0]=this.multipol;
    this.array[1] =this.fake1;
    this.array[2] =this.fake2;
    this.array[3] =this.fake3;
    this.array[4] =this.fake4;
    this.array[5]=this.group;

    Data.array_of_multipoles_objects[this.id] = this.array;


    for(let i=1;i<5;i++){
      this.array[i].set("suradnicaLeft",this.group.left);
      this.array[i].set("suradnicaTop",this.group.top);
      this.array[i].set("zakladnaFarba","pink");
      this.array[i].set("type","fakeVrchol");
      this.array[i].set("pocetHran",0);
      this.array[i].set("multipol",this.id);
      this.array[i].lockMovementX=true;
      this.array[i].lockMovementY=true;
      this.array[i].set("typ_multipola","multipol4");
    }


  }


  execute() {
    if(this.first_time){
      Data.canvas.add(this.group);
      this.first_time=false;
    }
    else {
      Data.array_of_multipoles_objects[this.multipol.name][5].set("left",this.multipol.suradnicaLeft);
      Data.array_of_multipoles_objects[this.multipol.name][5].set("top",this.multipol.suradnicaTop);

      for (let i = 0; i < Data.array_of_multipoles_objects[this.group.name].length-1; i++) {
        Data.canvas.add(Data.array_of_multipoles_objects[this.group.name][i]);
      }
      this.multipol.item(0).set("fill",this.group.farbaSpojenia);
    }
    Data.multipoles_in_graph.push(this.multipolJS);
  }

  unexecute() {
    Data.canvas.remove(this.group);
    const left = this.group.left;
    const top = this.group.top;

    for(let i=0;i<5;i++){
      this.group.item(i).set("suradnicaLeft",left);
      this.group.item(i).set("suradnicaTop",top);
    }

    for(var i=0; i<Data.array_of_multipoles_objects[this.group.name].length-1; i++){
      Data.canvas.remove(Data.array_of_multipoles_objects[this.group.name][i]);
    }

    let index = Data.multipoles_in_graph.indexOf(this.multipolJS);
    Data.multipoles_in_graph.splice(index,1);

  }
}
