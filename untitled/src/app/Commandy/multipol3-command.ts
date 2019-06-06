import {Command} from './command';
import {fabric} from 'fabric';
import {Informacie} from '../informacie';

export class Multipol3Command implements Command{
  group:any;
  fake1:any;
  fake2:any;
  fake3:any;
  multipol:any;
  array:any;
  prvykrat:boolean;
  meno:number;
  multipolJS:any;




  constructor(meno,fake1meno,fake2meno,fake3meno,type){
    this.multipolJS={
      name:type,
      id:meno,


    };
    this.meno = meno;
    this.prvykrat=true;
    this.array = new Array();

    //vytvaranie stredu multipola
    let stredKruh = new fabric.Circle({
      radius:50,
      fill:'#66CCFF',
      top:200,
      left:100,
      stroke:"black",
      strokeWidth:5,
    });

    let text=new fabric.Text(meno.toString(), {left: stredKruh.left+42,
      top: stredKruh.top+27,
      fill:"transparent"
    });

    this.multipol = new fabric.Group();
    this.multipol.addWithUpdate(stredKruh);
    this.multipol.addWithUpdate(text);
    this.multipol.set("type","multipol");
    this.multipol.set("vypis",type);
    this.multipol.set("left",100);
    this.multipol.set("top",200);
    this.multipol.set("name",this.meno); // tu mozno radse meno.toString()
    this.multipol.lockMovementX=true;
    this.multipol.lockMovementY=true;

    //vytvaranie semi-edges
    this.fake1 = new fabric.Circle({
      radius:30,
      fill:"pink",
      top:130,
      stroke:"black",
      left:122,
      strokeWidth:5,
      name:fake1meno
    });


    this.fake2 = new fabric.Circle({
      radius:30,
      fill:"pink",
      top:252,
      stroke:"black",
      left:35,
      strokeWidth:5,
      name:fake2meno
    });
    this.fake3 = new fabric.Circle({
      radius:30,
      fill:"pink",
      top:252,
      stroke:"black",
      left:205,
      strokeWidth:5,
      name:fake3meno
    });

    //vytvorenie objektu multipol3
    this.group = new fabric.Group();
    this.group.addWithUpdate(this.multipol);
    this.group.addWithUpdate(this.fake1);
    this.group.addWithUpdate(this.fake2);
    this.group.addWithUpdate(this.fake3);
    this.group.set("type","multipol3");
    this.group.set("name",this.meno);
    this.group.lockScalingX=true;
    this.group.lockScalingY=true;
    this.group.lockRotation=true;
    this.group.set("farbaSpojenia","#4D6AFF");
    this.group.set("zakladnaFarba","#66CCFF");

    //pridanie doubleclick funkcie pre stred multipola
    this.multipol.on("mousedblclick",function(options){

      for(let i=0;i<Informacie.poleMultipolov[this.name].length-1;i++){
        Informacie.plocha.remove(Informacie.poleMultipolov[this.name][i]);
      }

      Informacie.poleMultipolov[this.name][4].set("left",this.suradnicaLeft);
      Informacie.poleMultipolov[this.name][4].set("top",this.suradnicaTop);
      this.item(0).set("fill",Informacie.poleMultipolov[this.name][4].zakladnaFarba);
      Informacie.plocha.add(Informacie.poleMultipolov[this.name][4]);

      Informacie.plocha.remove(Informacie.vizitka);  //odstrani vizitku ktora je stale na ploche
      Informacie.plocha.renderAll();


    });

    //pridanie doubleclick funkcie pre cely multipol
    this.group.on("mousedblclick",function(){
      const lave = this.left;
      const horne = this.top;

      for(let i=0;i<4;i++){
        this.item(i).set("suradnicaLeft",lave);
        this.item(i).set("suradnicaTop",horne);
        Informacie.plocha.add(this.item(i));
      }
      this.item(0).item(0).set("fill",this.farbaSpojenia);

      Informacie.plocha.remove(this);
      Informacie.plocha.renderAll();
    });

    //pridanie vsetkych potrebnych objektov do globalneho pola a popridavanie este nejakych potrebnych atributov k objektom
    this.array[0]=this.multipol;
    this.array[1] =this.fake1;
    this.array[2] =this.fake2;
    this.array[3] =this.fake3;
    this.array[4]=this.group;

    Informacie.poleMultipolov[this.meno] = this.array;

    this.multipol.set("suradnicaLeft",this.group.left);
    this.multipol.set("suradnicaTop",this.group.top);

    for(let i=1;i<4;i++){
      this.array[i].set("suradnicaLeft",this.group.left);
      this.array[i].set("suradnicaTop",this.group.top);
      this.array[i].set("zakladnaFarba","pink");
      this.array[i].set("type","fakeVrchol");
      this.array[i].set("pocetHran",0);
      this.array[i].set("multipol",this.meno);
      this.array[i].lockMovementX=true;
      this.array[i].lockMovementY=true;
      this.array[i].set("typ_multipola","multipol3");
    }

    let fake1JS = {type:"multipol",id:this.meno,dangling_edge:this.fake1.name};
    let fake2JS = {type:"multipol",id:this.meno,dangling_edge:this.fake2.name};
    let fake3JS = {type:"multipol",id:this.meno,dangling_edge:this.fake3.name};

    this.fake1.set("reprezentaciaJS",fake1JS);
    this.fake2.set("reprezentaciaJS",fake2JS);
    this.fake3.set("reprezentaciaJS",fake3JS);
  }

  execute() {
    if(this.prvykrat){
      Informacie.plocha.add(this.group);
      this.prvykrat=false;
    }
    else {
      Informacie.poleMultipolov[this.multipol.name][4].set("left",this.multipol.suradnicaLeft);
      Informacie.poleMultipolov[this.multipol.name][4].set("top",this.multipol.suradnicaTop);

      for (let i = 0; i < Informacie.poleMultipolov[this.group.name].length-1; i++) {
        Informacie.plocha.add(Informacie.poleMultipolov[this.group.name][i]);
      }
      this.multipol.item(0).set("fill",this.group.farbaSpojenia);
    }
    Informacie.multipolyVGrafe.push(this.multipolJS);
  }

  unexecute() {
    Informacie.plocha.remove(this.group);
    const lave = this.group.left;
    const horne = this.group.top;

    for(let i=0;i<4;i++){
      this.group.item(i).set("suradnicaLeft",lave);
      this.group.item(i).set("suradnicaTop",horne);
    }

    for(var i=0;i<Informacie.poleMultipolov[this.group.name].length-1;i++){
      Informacie.plocha.remove(Informacie.poleMultipolov[this.group.name][i]);
    }

    let index = Informacie.multipolyVGrafe.indexOf(this.multipolJS);
    Informacie.multipolyVGrafe.splice(index,1);

  }
}
