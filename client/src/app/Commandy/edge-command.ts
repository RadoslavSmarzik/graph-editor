import {fabric} from 'fabric';
import {Command} from './command';
import {Data} from '../data';


export class EdgeCommand implements Command{

  polyLine:any;
  first:any;
  second:any;
  edgeJS:any;



  constructor(first_obj,second_obj){
    this.first=first_obj;
    this.second=second_obj;
    this.edgeJS = {"first":first_obj.reprezentaciaJS, "second":second_obj.reprezentaciaJS};

  }

  set_positions_of_polyline_multipol(fakeVertex, points){
    if(fakeVertex.typ_multipola == "multipol4") {
      points.push(new fabric.Point(fakeVertex.suradnicaLeft + 125, fakeVertex.suradnicaTop + 125));
    }
    if(fakeVertex.typ_multipola == "multipol2") {
      points.push(new fabric.Point(fakeVertex.suradnicaLeft + 125, fakeVertex.suradnicaTop + 47.5));
    }
    if(fakeVertex.typ_multipola == "multipol3") {
      points.push(new fabric.Point(fakeVertex.suradnicaLeft + 117.5, fakeVertex.suradnicaTop + 120));
    }
    if(fakeVertex.typ_multipola == "multipol5") {
      points.push(new fabric.Point(fakeVertex.suradnicaLeft + 117.5, fakeVertex.suradnicaTop + 117.5));
    }
  }

  create_polyline(points){
    this.polyLine = new fabric.Polyline(points, {
      stroke: 'black',
      strokeWidth:5,
      selectable:false,
    });
    this.polyLine.set("type","edge");          //tu bol type hrana
    this.first.set("pocetHran",this.first.pocetHran+1);
    this.second.set("pocetHran",this.second.pocetHran+1);
    Data.canvas.add(this.polyLine);
    Data.canvas.moveTo(this.polyLine, -100);

    this.first.lockMovementX=true;
    this.first.lockMovementY=true;
    this.second.lockMovementX=true;
    this.second.lockMovementY=true;
    Data.edges_in_graph.push(this.edgeJS);
  }




  make_vertex_moveable(vertex){
    vertex.lockMovementX = false;
    vertex.lockMovementY = false;
    vertex.item(0).set("fill",vertex.zakladnaFarba);
    vertex.set("aktualnaFarba",vertex.zakladnaFarba);
  }

  how_many_edges_multipol_has(multipol){
    let edges=0;
    for(let i=1; i<Data.array_of_multipoles_objects[multipol].length-1; i++){
      edges+=Data.array_of_multipoles_objects[multipol][i].pocetHran;
    }
    return edges;

  }

  multipol_becomes_moveable(multipol){
    Data.array_of_multipoles_objects[multipol][0].on("mousedblclick", function (options) {

      for (let i = 0; i < Data.array_of_multipoles_objects[this.name].length - 1; i++) {
        Data.canvas.remove(Data.array_of_multipoles_objects[this.name][i]);
      }

      let index_of_group =Data.array_of_multipoles_objects[this.name].length -1;

      Data.array_of_multipoles_objects[this.name][index_of_group].set("left", this.suradnicaLeft);
      Data.array_of_multipoles_objects[this.name][index_of_group].set("top", this.suradnicaTop);
      Data.canvas.add(Data.array_of_multipoles_objects[this.name][index_of_group]);
      Data.array_of_multipoles_objects[this.name][0].item(0).set("fill", Data.array_of_multipoles_objects[this.name][index_of_group].zakladnaFarba);

      Data.canvas.remove(Data.label);
      Data.canvas.renderAll();


    });



  }



  //pridanie novej hrany, suradnice polyline sa vypocitavaju podla toho kolko ma multipol vytrcajucich hran
  execute() {
    const points = [];

    if(this.first.type=="fakeVrchol"){
      Data.canvas.remove(this.first);

      Data.canvas.remove(Data.label);
      Data.array_of_multipoles_objects[this.first.multipol][0].off("mousedblclick");

      this.set_positions_of_polyline_multipol(this.first,points);
      let index_of_group = Data.array_of_multipoles_objects[this.first.multipol].length-1;
      Data.array_of_multipoles_objects[this.first.multipol][0].item(0).set("fill",Data.array_of_multipoles_objects[this.first.multipol][index_of_group].farbaSpojenia);

    }

    else {
      this.first.item(0).set("fill",this.first.farbaSpojenia);
      this.first.set("aktualnaFarba",this.first.farbaSpojenia);
      points.push(new fabric.Point(this.first.left + 32.5, this.first.top + 32.5));
    }



    if(this.second.type=="fakeVrchol") {
      Data.canvas.remove(this.second);

      Data.canvas.remove(Data.label);
      Data.array_of_multipoles_objects[this.second.multipol][0].off("mousedblclick");

      this.set_positions_of_polyline_multipol(this.second,points);
      let index_of_group = Data.array_of_multipoles_objects[this.second.multipol].length-1;
      Data.array_of_multipoles_objects[this.second.multipol][0].item(0).set("fill",Data.array_of_multipoles_objects[this.second.multipol][index_of_group].farbaSpojenia);

    }
    else {
      this.second.item(0).set("fill",this.second.farbaSpojenia);
      this.second.set("aktualnaFarba",this.second.farbaSpojenia);
      points.push(new fabric.Point(this.second.left + 32.5, this.second.top + 32.5));
    }


    this.create_polyline(points);



  }


  //odstrani hranu a podla toho kolko ma multipol este ku sebe pripojenych hran, ak tych hran je 0 tak mu nastavime to ze doubleclickom s nim mozme opat hybat
  unexecute() {
    Data.canvas.remove(this.polyLine);
    let index = Data.edges_in_graph.indexOf(this.edgeJS);
    if (index !== -1) Data.edges_in_graph.splice(index, 1);
 
    this.first.set("pocetHran",this.first.pocetHran-1);
    this.second.set("pocetHran",this.second.pocetHran-1);
    //prepocet kolko hran vedie z vchola a podla toho mu umoznime sa hybat
    if(this.first.pocetHran == 0 && this.first.type == "vertex"){
      this.make_vertex_moveable(this.first);

    }
    if(this.second.pocetHran == 0 && this.second.type == "vertex") {
      this.make_vertex_moveable(this.second);
    }

    //prepocet kolko hran ide z multipola a podla toho pridavame doublecklick na stred multipola
    if(this.first.type == "fakeVrchol"){
      Data.canvas.add(this.first);


      if(this.how_many_edges_multipol_has(this.first.multipol) == 0){
        this.multipol_becomes_moveable(this.first.multipol);
      }
    }

    //prepocet kolko hran ide z multipola a podla toho pridavame doublecklick na stred multipola
    if(this.second.type == "fakeVrchol"){
      Data.canvas.add(this.second);

      if(this.how_many_edges_multipol_has(this.second.multipol) == 0){
        this.multipol_becomes_moveable(this.second.multipol);
      }



    }



  }
}
