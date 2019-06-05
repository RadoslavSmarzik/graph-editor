import {Command} from './command';
import {fabric} from 'fabric';
import {Informacie} from '../informacie';

export class ClearCommand implements Command{
  canvas:fabric.Canvas;
  objekty:Array<any>;
  staryPocet:number;
  stareHrany:any;
  stareVrcholy:any;
  stareMultipoly:any;

  constructor(c:any,n:number ){
    this.stareHrany=[];
    this.stareVrcholy=[];
    this.stareMultipoly=[];
    this.canvas=c;
    this.staryPocet=n;
    for(let i=0;i<Informacie.hranyVGrafe.length;i++){
      this.stareHrany.push(Informacie.hranyVGrafe[i]);

    }
    for(let i=0;i<Informacie.vrcholyVGrafe.length;i++){
      this.stareVrcholy.push(Informacie.vrcholyVGrafe[i]);

    }
    for(let i=0;i<Informacie.multipolyVGrafe.length;i++){
      this.stareMultipoly.push(Informacie.multipolyVGrafe[i]);

    }
  }

  execute() {
    this.objekty = this.canvas.getObjects();

    this.canvas.clear();
    Informacie.multipolyVGrafe=[];
    Informacie.vrcholyVGrafe=[];
    Informacie.hranyVGrafe=[];



  }

  unexecute() {
    while(this.objekty.length>0){

      this.canvas.add(this.objekty.pop());

    }
    for(let i=0;i<this.objekty.length;i++){
      if(this.objekty[i].get("type")=="polyline"){
        this.canvas.add(this.objekty[i]);
      }
    }
    for(let i=0;i<this.stareHrany.length;i++){
      Informacie.hranyVGrafe.push(this.stareHrany[i]);

    }
    for(let i=0;i<this.stareVrcholy.length;i++){
      Informacie.vrcholyVGrafe.push(this.stareVrcholy[i]);

    }
    for(let i=0;i<this.stareMultipoly.length;i++){
      Informacie.multipolyVGrafe.push(this.stareMultipoly[i]);

    }



  }
}
