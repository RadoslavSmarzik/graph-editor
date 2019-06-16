import {Command} from './Commands/command';


export class Data {
  static selectedVertex: any;                //pamatam si ktory circle je selectnuty
  static firstVertex:any;                     //first selektnuty circle
  static secondVertex:any;                    //second selectnuty circle
  static commands:Array<Command>;            //pole commandov
  static state:number;              //vyuzivam pri undo/redo
  static canvas: any;                        //fabric.canvas
  static array_of_multipoles_objects: any;                //pole do ktoreho ukladam objekty multipolov
  static multipoles_in_graph:Array<any>;         //pole multipolov reprezentujucich ako jsony
  static edges_in_graph:Array<any>;             //pole hran reprezentujucich ako jsony
  static vertices_in_graph:Array<any>;        //pole vrcholov reprezentujucich ako jsony
  static multipoles_for_use:Array<any>;     //pole multipolov ktore dostanem od servera
  static name_of_active_object:any;
  static redoBooelan: any;
  static label: any;
  static graph_code:any;                     //kod grafu ktory budem dostavat
  static multipolesHidden:any;
  static multipolesNames:any;
  static codeDisable:any;


}
