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

  //pridanie novej hrany, suradnice polyline sa vypocitavaju podla toho kolko ma multipol vytrcajucich hran
  execute() {
    const points = [];

    if(this.prvy.type=="fakeVrchol"){
      Informacie.plocha.remove(this.prvy);

      Informacie.plocha.remove(Informacie.vizitka);
      Informacie.poleMultipolov[this.prvy.multipol][0].off("mousedblclick");

      if(this.prvy.typ_multipola == "multipol4") {
        points.push(new fabric.Point(this.prvy.suradnicaLeft + 125, this.prvy.suradnicaTop + 125));
      }
      if(this.prvy.typ_multipola == "multipol2") {
        points.push(new fabric.Point(this.prvy.suradnicaLeft + 125, this.prvy.suradnicaTop + 47.5));
      }
      if(this.prvy.typ_multipola == "multipol3") {
        points.push(new fabric.Point(this.prvy.suradnicaLeft + 117.5, this.prvy.suradnicaTop + 120));
      }
      if(this.prvy.typ_multipola == "multipol5") {
        points.push(new fabric.Point(this.prvy.suradnicaLeft + 117.5, this.prvy.suradnicaTop + 117.5));
      }
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

      if(this.druhy.typ_multipola == "multipol4") {
        points.push(new fabric.Point(this.druhy.suradnicaLeft + 125, this.druhy.suradnicaTop + 125));
      }
      if(this.druhy.typ_multipola == "multipol2") {
        points.push(new fabric.Point(this.druhy.suradnicaLeft + 125, this.druhy.suradnicaTop + 47.5));
      }
      if(this.druhy.typ_multipola == "multipol3") {
        points.push(new fabric.Point(this.druhy.suradnicaLeft + 117.5, this.druhy.suradnicaTop + 120));
      }
      if(this.druhy.typ_multipola == "multipol5") {
        points.push(new fabric.Point(this.druhy.suradnicaLeft + 117.5, this.druhy.suradnicaTop + 117.5));
      }
      let index_of_group = Informacie.poleMultipolov[this.druhy.multipol].length-1;
      Informacie.poleMultipolov[this.druhy.multipol][0].item(0).set("fill",Informacie.poleMultipolov[this.druhy.multipol][index_of_group].farbaSpojenia);

    }
    else {
      this.druhy.item(0).set("fill",this.druhy.farbaSpojenia);
      this.druhy.set("aktualnaFarba",this.druhy.farbaSpojenia);
      points.push(new fabric.Point(this.druhy.left + 32.5, this.druhy.top + 32.5));
    }


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
      this.prvy.lockMovementX = false;
      this.prvy.lockMovementY = false;
      this.prvy.item(0).set("fill",this.prvy.zakladnaFarba);
      this.prvy.set("aktualnaFarba",this.prvy.zakladnaFarba);

    }
    if(this.druhy.pocetHran == 0 && this.druhy.type == "vertex") {
      this.druhy.lockMovementX = false;
      this.druhy.lockMovementY = false;
      this.druhy.item(0).set("fill",this.druhy.zakladnaFarba);
      this.druhy.set("aktualnaFarba",this.druhy.zakladnaFarba);
    }

    //prepocet kolko hran ide z multipola a podla toho pridavame doublecklick na stred multipola
    if(this.prvy.type == "fakeVrchol"){
      Informacie.plocha.add(this.prvy);

      let celkovoHran=0;
      for(let i=1;i<Informacie.poleMultipolov[this.prvy.multipol].length-1;i++){
        celkovoHran+=Informacie.poleMultipolov[this.prvy.multipol][i].pocetHran;
      }
      if(celkovoHran == 0){
        if(this.prvy.typ_multipola == "multipol4") {
          Informacie.poleMultipolov[this.prvy.multipol][0].on("mousedblclick", function (options) {

            for (let i = 0; i < Informacie.poleMultipolov[this.name].length - 1; i++) {
              Informacie.plocha.remove(Informacie.poleMultipolov[this.name][i]);
            }

            Informacie.poleMultipolov[this.name][5].set("left", this.suradnicaLeft);
            Informacie.poleMultipolov[this.name][5].set("top", this.suradnicaTop);
            Informacie.plocha.add(Informacie.poleMultipolov[this.name][5]);
            Informacie.poleMultipolov[this.name][0].item(0).set("fill", Informacie.poleMultipolov[this.name][5].zakladnaFarba);

            Informacie.plocha.remove(Informacie.vizitka);
            Informacie.plocha.renderAll();


          });
        }
        if(this.prvy.typ_multipola == "multipol5") {
          Informacie.poleMultipolov[this.prvy.multipol][0].on("mousedblclick", function (options) {

            for (let i = 0; i < Informacie.poleMultipolov[this.name].length - 1; i++) {
              Informacie.plocha.remove(Informacie.poleMultipolov[this.name][i]);
            }

            Informacie.poleMultipolov[this.name][6].set("left", this.suradnicaLeft);
            Informacie.poleMultipolov[this.name][6].set("top", this.suradnicaTop);
            Informacie.plocha.add(Informacie.poleMultipolov[this.name][6]);
            Informacie.poleMultipolov[this.name][0].item(0).set("fill", Informacie.poleMultipolov[this.name][6].zakladnaFarba);

            Informacie.plocha.remove(Informacie.vizitka);
            Informacie.plocha.renderAll();


          });
        }

        if(this.prvy.typ_multipola == "multipol3") {
          Informacie.poleMultipolov[this.prvy.multipol][0].on("mousedblclick", function (options) {

            for (let i = 0; i < Informacie.poleMultipolov[this.name].length - 1; i++) {
              Informacie.plocha.remove(Informacie.poleMultipolov[this.name][i]);
            }

            Informacie.poleMultipolov[this.name][4].set("left", this.suradnicaLeft);
            Informacie.poleMultipolov[this.name][4].set("top", this.suradnicaTop);
            Informacie.plocha.add(Informacie.poleMultipolov[this.name][4]);
            Informacie.poleMultipolov[this.name][0].item(0).set("fill", Informacie.poleMultipolov[this.name][4].zakladnaFarba);

            Informacie.plocha.remove(Informacie.vizitka);
            Informacie.plocha.renderAll();


          });
        }

        if(this.prvy.typ_multipola == "multipol2") {
          Informacie.poleMultipolov[this.prvy.multipol][0].on("mousedblclick", function (options) {

            for (let i = 0; i < Informacie.poleMultipolov[this.name].length - 1; i++) {
              Informacie.plocha.remove(Informacie.poleMultipolov[this.name][i]);
            }

            Informacie.poleMultipolov[this.name][3].set("left", this.suradnicaLeft);
            Informacie.poleMultipolov[this.name][3].set("top", this.suradnicaTop);
            Informacie.plocha.add(Informacie.poleMultipolov[this.name][3]);
            Informacie.poleMultipolov[this.name][0].item(0).set("fill", Informacie.poleMultipolov[this.name][3].zakladnaFarba);

            Informacie.plocha.remove(Informacie.vizitka);
            Informacie.plocha.renderAll();


          });
        }

      }
    }

    //prepocet kolko hran ide z multipola a podla toho pridavame doublecklick na stred multipola
    if(this.druhy.type == "fakeVrchol"){
      Informacie.plocha.add(this.druhy);

      let celkovoHran=0;
      for(let i=1;i<Informacie.poleMultipolov[this.druhy.multipol].length-1;i++){
        celkovoHran+=Informacie.poleMultipolov[this.druhy.multipol][i].pocetHran;
      }
      if(celkovoHran == 0){
        if(this.druhy.typ_multipola == "multipol4") {
          Informacie.poleMultipolov[this.druhy.multipol][0].on("mousedblclick", function (options) {

            for (let i = 0; i < Informacie.poleMultipolov[this.name].length - 1; i++) {
              Informacie.plocha.remove(Informacie.poleMultipolov[this.name][i]);
            }

            Informacie.poleMultipolov[this.name][5].set("left", this.suradnicaLeft);
            Informacie.poleMultipolov[this.name][5].set("top", this.suradnicaTop);
            Informacie.plocha.add(Informacie.poleMultipolov[this.name][5]);
            Informacie.poleMultipolov[this.name][0].item(0).set("fill", Informacie.poleMultipolov[this.name][5].zakladnaFarba);

            Informacie.plocha.remove(Informacie.vizitka);
            Informacie.plocha.renderAll();
          });
        }
        if(this.druhy.typ_multipola == "multipol5") {
          Informacie.poleMultipolov[this.druhy.multipol][0].on("mousedblclick", function (options) {

            for (let i = 0; i < Informacie.poleMultipolov[this.name].length - 1; i++) {
              Informacie.plocha.remove(Informacie.poleMultipolov[this.name][i]);
            }

            Informacie.poleMultipolov[this.name][6].set("left", this.suradnicaLeft);
            Informacie.poleMultipolov[this.name][6].set("top", this.suradnicaTop);
            Informacie.plocha.add(Informacie.poleMultipolov[this.name][6]);
            Informacie.poleMultipolov[this.name][0].item(0).set("fill", Informacie.poleMultipolov[this.name][6].zakladnaFarba);

            Informacie.plocha.remove(Informacie.vizitka);
            Informacie.plocha.renderAll();
          });
        }

        if(this.druhy.typ_multipola == "multipol3") {
          Informacie.poleMultipolov[this.druhy.multipol][0].on("mousedblclick", function (options) {

            for (let i = 0; i < Informacie.poleMultipolov[this.name].length - 1; i++) {
              Informacie.plocha.remove(Informacie.poleMultipolov[this.name][i]);
            }

            Informacie.poleMultipolov[this.name][4].set("left", this.suradnicaLeft);
            Informacie.poleMultipolov[this.name][4].set("top", this.suradnicaTop);
            Informacie.plocha.add(Informacie.poleMultipolov[this.name][4]);
            Informacie.poleMultipolov[this.name][0].item(0).set("fill", Informacie.poleMultipolov[this.name][4].zakladnaFarba);

            Informacie.plocha.remove(Informacie.vizitka);
            Informacie.plocha.renderAll();


          });
        }

        if(this.druhy.typ_multipola == "multipol2") {
          Informacie.poleMultipolov[this.druhy.multipol][0].on("mousedblclick", function (options) {

            for (let i = 0; i < Informacie.poleMultipolov[this.name].length - 1; i++) {
              Informacie.plocha.remove(Informacie.poleMultipolov[this.name][i]);
            }

            Informacie.poleMultipolov[this.name][3].set("left", this.suradnicaLeft);
            Informacie.poleMultipolov[this.name][3].set("top", this.suradnicaTop);
            Informacie.plocha.add(Informacie.poleMultipolov[this.name][3]);
            Informacie.poleMultipolov[this.name][0].item(0).set("fill", Informacie.poleMultipolov[this.name][3].zakladnaFarba);

            Informacie.plocha.remove(Informacie.vizitka);
            Informacie.plocha.renderAll();


          });
        }


      }
    }



  }
}
