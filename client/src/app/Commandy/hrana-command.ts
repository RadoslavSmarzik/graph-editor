import {fabric} from 'fabric';
import {Command} from './command';
import {Informacie} from '../informacie';
import {IndexedSourceMapConsumer} from 'source-map';

export class HranaCommand implements Command{

  polyLine:any;
  prvy:any;
  druhy:any;
  hranaJS:any;



  constructor(prvy,druhy,c){
    this.prvy=prvy;
    this.druhy=druhy;
    this.hranaJS = {"first":prvy.reprezentaciaJS, "second":druhy.reprezentaciaJS};

  }

  set_suradnice_polyline_fakeVrchol(fake,points){
    if(fake.typ_multipola == "multipol4") {
      points.push(new fabric.Point(fake.suradnicaLeft + 125, fake.suradnicaTop + 125));
    }
    if(fake.typ_multipola == "multipol2") {
      points.push(new fabric.Point(fake.suradnicaLeft + 125, fake.suradnicaTop + 47.5));
    }
    if(fake.typ_multipola == "multipol3") {
      points.push(new fabric.Point(fake.suradnicaLeft + 117.5, fake.suradnicaTop + 120));
    }
    if(fake.typ_multipola == "multipol5") {
      points.push(new fabric.Point(fake.suradnicaLeft + 117.5, fake.suradnicaTop + 117.5));
    }
  }

  create_polyline(points){
    this.polyLine = new fabric.Polyline(points, {
      stroke: 'black',
      strokeWidth:5,
      selectable:false,
    });
    this.polyLine.set("type","edge");          //tu bol type hrana
    this.prvy.set("pocetHran",this.prvy.pocetHran+1);
    this.druhy.set("pocetHran",this.druhy.pocetHran+1);
    Informacie.plocha.add(this.polyLine);
    Informacie.plocha.moveTo(this.polyLine, -100);

    this.prvy.lockMovementX=true;
    this.prvy.lockMovementY=true;
    this.druhy.lockMovementX=true;
    this.druhy.lockMovementY=true;
    Informacie.hranyVGrafe.push(this.hranaJS);
  }




  make_vertex_moveable(vertex){
    vertex.lockMovementX = false;
    vertex.lockMovementY = false;
    vertex.item(0).set("fill",vertex.zakladnaFarba);
    vertex.set("aktualnaFarba",vertex.zakladnaFarba);
  }

  how_many_edges_from_multipol(multipol){
    let edges=0;
    for(let i=1;i<Informacie.poleMultipolov[multipol].length-1;i++){
      edges+=Informacie.poleMultipolov[multipol][i].pocetHran;
    }
    return edges;

  }

  multipol_become_moveable(multipol){
    Informacie.poleMultipolov[multipol][0].on("mousedblclick", function (options) {

      for (let i = 0; i < Informacie.poleMultipolov[this.name].length - 1; i++) {
        Informacie.plocha.remove(Informacie.poleMultipolov[this.name][i]);
      }

      let index_of_group =Informacie.poleMultipolov[this.name].length -1;

      Informacie.poleMultipolov[this.name][index_of_group].set("left", this.suradnicaLeft);
      Informacie.poleMultipolov[this.name][index_of_group].set("top", this.suradnicaTop);
      Informacie.plocha.add(Informacie.poleMultipolov[this.name][index_of_group]);
      Informacie.poleMultipolov[this.name][0].item(0).set("fill", Informacie.poleMultipolov[this.name][index_of_group].zakladnaFarba);

      Informacie.plocha.remove(Informacie.vizitka);
      Informacie.plocha.renderAll();


    });



  }



  //pridanie novej hrany, suradnice polyline sa vypocitavaju podla toho kolko ma multipol vytrcajucich hran
  execute() {
    const points = [];

    if(this.prvy.type=="fakeVrchol"){
      Informacie.plocha.remove(this.prvy);

      Informacie.plocha.remove(Informacie.vizitka);
      Informacie.poleMultipolov[this.prvy.multipol][0].off("mousedblclick");

      this.set_suradnice_polyline_fakeVrchol(this.prvy,points);
      let index_of_group = Informacie.poleMultipolov[this.prvy.multipol].length-1;
      Informacie.poleMultipolov[this.prvy.multipol][0].item(0).set("fill",Informacie.poleMultipolov[this.prvy.multipol][index_of_group].farbaSpojenia);

    }

    else {
      this.prvy.item(0).set("fill",this.prvy.farbaSpojenia);
      this.prvy.set("aktualnaFarba",this.prvy.farbaSpojenia);
      points.push(new fabric.Point(this.prvy.left + 32.5, this.prvy.top + 32.5));
    }



    if(this.druhy.type=="fakeVrchol") {
      Informacie.plocha.remove(this.druhy);

      Informacie.plocha.remove(Informacie.vizitka);
      Informacie.poleMultipolov[this.druhy.multipol][0].off("mousedblclick");

      this.set_suradnice_polyline_fakeVrchol(this.druhy,points);
      let index_of_group = Informacie.poleMultipolov[this.druhy.multipol].length-1;
      Informacie.poleMultipolov[this.druhy.multipol][0].item(0).set("fill",Informacie.poleMultipolov[this.druhy.multipol][index_of_group].farbaSpojenia);

    }
    else {
      this.druhy.item(0).set("fill",this.druhy.farbaSpojenia);
      this.druhy.set("aktualnaFarba",this.druhy.farbaSpojenia);
      points.push(new fabric.Point(this.druhy.left + 32.5, this.druhy.top + 32.5));
    }


    this.create_polyline(points);



  }


  //odstrani hranu a podla toho kolko ma multipol este ku sebe pripojenych hran, ak tych hran je 0 tak mu nastavime to ze doubleclickom s nim mozme opat hybat
  unexecute() {
    Informacie.plocha.remove(this.polyLine);
    let index = Informacie.hranyVGrafe.indexOf(this.hranaJS);
    if (index !== -1) Informacie.hranyVGrafe.splice(index, 1);
  //  Informacie.hranyVGrafe.splice(this.hranaJS,1);
    this.prvy.set("pocetHran",this.prvy.pocetHran-1);
    this.druhy.set("pocetHran",this.druhy.pocetHran-1);
    //prepocet kolko hran vedie z vchola a podla toho mu umoznime sa hybat
    if(this.prvy.pocetHran == 0 && this.prvy.type == "vertex"){
      this.make_vertex_moveable(this.prvy);

    }
    if(this.druhy.pocetHran == 0 && this.druhy.type == "vertex") {
      this.make_vertex_moveable(this.druhy);
    }

    //prepocet kolko hran ide z multipola a podla toho pridavame doublecklick na stred multipola
    if(this.prvy.type == "fakeVrchol"){
      Informacie.plocha.add(this.prvy);


      if(this.how_many_edges_from_multipol(this.prvy.multipol) == 0){
        this.multipol_become_moveable(this.prvy.multipol);
      }
    }

    //prepocet kolko hran ide z multipola a podla toho pridavame doublecklick na stred multipola
    if(this.druhy.type == "fakeVrchol"){
      Informacie.plocha.add(this.druhy);

      if(this.how_many_edges_from_multipol(this.druhy.multipol) == 0){
        this.multipol_become_moveable(this.druhy.multipol);
      }



    }



  }
}
