import {Command} from './Commandy/command';
import {AppComponent} from './app.component';

export class Informacie {
  static selectedVrchol: any;                //pamatam si ktory vrchol je selectnuty
  static prvyVrchol:any;                     //prvy selektnuty vrchol
  static druhyVrchol:any;                    //druhy selectnuty vrchol
  static commands:Array<Command>;            //pole commandov
  static momentalnyStav:number;              //vyuzivam pri undo/redo
  static plocha: any;                        //fabric.canvas
  static poleMultipolov: any;                //pole do ktoreho ukladam objekty multipolov
  static multipolyVGrafe:Array<any>;         //pole multipolov reprezentujucich ako jsony
  static hranyVGrafe:Array<any>;             //pole hran reprezentujucich ako jsony
  static vrcholyVGrafe:Array<number>;        //pole vrcholov reprezentujucich ako jsony
  static multipolyNaPouzitie:Array<any>;     //pole multipolov ktore dostanem od servera
  static  aktualneViditelneMeno:any;
  static redoBooelan: any;
  static vizitka: any;


}
