import {fabric} from 'fabric';
import {Command} from './command';
import {Informacie} from '../informacie';


export class VrcholCommand implements Command{
  plocha:any;
  vrchol: any;
  text:any;
  group:any;
  vrcholJS:any;
  meno:number;

  constructor(c,meno){
    this.meno=meno;
    this.vrcholJS = { type:"vertex", id:meno};
    this.plocha=c;
    this.vrchol = new fabric.Circle({
      radius:30,
      fill:'red',
      top:100,
      left:100,
      stroke:"black",
      name:meno.toString(),
      strokeWidth:5,

    });

    this.vrchol.set("zakladnaFarba","red");
    this.text=new fabric.Text(meno.toString(), {left: this.vrchol.left+22,
                                            top: this.vrchol.top+7,
                                            fill:"transparent"
    });




    this.group = new fabric.Group([ this.vrchol, this.text ], {
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
    this.group.set("reprezentaciaJS",this.vrcholJS);
    this.group.set("farbaSpojenia","#B31B00");
    this.group.set("zakladnaFarba","red");
    this.group.set("aktualnaFarba","red");


  }





  execute() {
    this.plocha.add(this.group);
    this.plocha.moveTo(this.group, 100);
    Informacie.vrcholyVGrafe.push(this.meno);

  }

  unexecute() {
    this.plocha.remove(this.group);

    let index = Informacie.vrcholyVGrafe.indexOf(this.meno);
    Informacie.vrcholyVGrafe.splice(index,1);

  }


}

