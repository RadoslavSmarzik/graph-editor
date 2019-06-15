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
    this.edgeJS = {"first":first_obj.representationJS, "second":second_obj.representationJS};

  }

  set_positions_of_polyline_multipol(fakeVertex, points){
    if(fakeVertex.multipol_type == "multipol4") {
      points.push(new fabric.Point(fakeVertex.positionLeft + 125, fakeVertex.positionTop + 125));
    }
    if(fakeVertex.multipol_type == "multipol2") {
      points.push(new fabric.Point(fakeVertex.positionLeft + 125, fakeVertex.positionTop + 47.5));
    }
    if(fakeVertex.multipol_type == "multipol3") {
      points.push(new fabric.Point(fakeVertex.positionLeft + 117.5, fakeVertex.positionTop + 120));
    }
    if(fakeVertex.multipol_type == "multipol5") {
      points.push(new fabric.Point(fakeVertex.positionLeft + 117.5, fakeVertex.positionTop + 117.5));
    }
  }

  create_polyline(points){
    this.polyLine = new fabric.Polyline(points, {
      stroke: 'black',
      strokeWidth:5,
      selectable:false,
    });
    this.polyLine.set("type","edge");
    this.first.set("edges",this.first.edges+1);
    this.second.set("edges",this.second.edges+1);
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
    vertex.item(0).set("fill",vertex.main_color);
    vertex.set("now_color",vertex.main_color);
  }

  how_many_edges_multipol_has(multipol){
    let edges=0;
    for(let i=1; i<Data.array_of_multipoles_objects[multipol].length-1; i++){
      edges+=Data.array_of_multipoles_objects[multipol][i].edges;
    }
    return edges;

  }

  multipol_becomes_moveable(multipol){
    Data.array_of_multipoles_objects[multipol][0].on("mousedblclick", function (options) {

      for (let i = 0; i < Data.array_of_multipoles_objects[this.name].length - 1; i++) {
        Data.canvas.remove(Data.array_of_multipoles_objects[this.name][i]);
      }

      let index_of_group =Data.array_of_multipoles_objects[this.name].length -1;

      Data.array_of_multipoles_objects[this.name][index_of_group].set("left", this.positionLeft);
      Data.array_of_multipoles_objects[this.name][index_of_group].set("top", this.positionTop);
      Data.canvas.add(Data.array_of_multipoles_objects[this.name][index_of_group]);
      Data.array_of_multipoles_objects[this.name][0].item(0).set("fill", Data.array_of_multipoles_objects[this.name][index_of_group].main_color);

      Data.canvas.remove(Data.label);
      Data.canvas.renderAll();

    });

  }


  execute() {
    const points = [];

    if(this.first.type=="fakeVrchol"){
      Data.canvas.remove(this.first);

      Data.canvas.remove(Data.label);
      Data.array_of_multipoles_objects[this.first.multipol][0].off("mousedblclick");

      this.set_positions_of_polyline_multipol(this.first,points);
      let index_of_group = Data.array_of_multipoles_objects[this.first.multipol].length-1;
      Data.array_of_multipoles_objects[this.first.multipol][0].item(0).set("fill",Data.array_of_multipoles_objects[this.first.multipol][index_of_group].static_color);

    }

    else {
      this.first.item(0).set("fill",this.first.static_color);
      this.first.set("now_color",this.first.static_color);
      points.push(new fabric.Point(this.first.left + 32.5, this.first.top + 32.5));
    }



    if(this.second.type=="fakeVrchol") {
      Data.canvas.remove(this.second);

      Data.canvas.remove(Data.label);
      Data.array_of_multipoles_objects[this.second.multipol][0].off("mousedblclick");

      this.set_positions_of_polyline_multipol(this.second,points);
      let index_of_group = Data.array_of_multipoles_objects[this.second.multipol].length-1;
      Data.array_of_multipoles_objects[this.second.multipol][0].item(0).set("fill",Data.array_of_multipoles_objects[this.second.multipol][index_of_group].static_color);

    }
    else {
      this.second.item(0).set("fill",this.second.static_color);
      this.second.set("now_color",this.second.static_color);
      points.push(new fabric.Point(this.second.left + 32.5, this.second.top + 32.5));
    }
    this.create_polyline(points);

  }


  unexecute() {
    Data.canvas.remove(this.polyLine);
    let index = Data.edges_in_graph.indexOf(this.edgeJS);
    if (index !== -1) Data.edges_in_graph.splice(index, 1);
 
    this.first.set("edges",this.first.edges-1);
    this.second.set("edges",this.second.edges-1);

    if(this.first.edges == 0 && this.first.type == "vertex"){
      this.make_vertex_moveable(this.first);

    }
    if(this.second.edges == 0 && this.second.type == "vertex") {
      this.make_vertex_moveable(this.second);
    }

    if(this.first.type == "fakeVrchol"){
      Data.canvas.add(this.first);
      if(this.how_many_edges_multipol_has(this.first.multipol) == 0){
        this.multipol_becomes_moveable(this.first.multipol);
      }
    }

    if(this.second.type == "fakeVrchol"){
      Data.canvas.add(this.second);
      if(this.how_many_edges_multipol_has(this.second.multipol) == 0){
        this.multipol_becomes_moveable(this.second.multipol);
      }

    }

  }
}
