import {Component, OnInit} from '@angular/core';
import {fabric} from 'fabric';
import {ClearCommand} from './Commandy/clear-command';
import {VrcholCommand} from './Commandy/vrchol-command';
import {Informacie} from './informacie';
import {HranaCommand} from './Commandy/hrana-command';
import {Multipol4Command} from './Commandy/multipol4-command';
import {Multipol3Command} from './Commandy/multipol3-command';
import {Multipol2Command} from './Commandy/multipol2-command';
import * as $ from 'jquery';
import {Multipol5Command} from './Commandy/multipol5-command';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  pocetVrcholov: number;
  canvas: any;
  disableStart: Boolean;
  disableStop: Boolean;
  disableUndo: Boolean;
  disableRedo: any;
  cisloVrchola: number;
  multipolmeno:number=1;
  disableGet:Boolean;
  hideMultipoly:Array<Boolean>;
  menoMultipolov:Array<any>;




  ngOnInit(): void {
    this.hideMultipoly=[];
    this.menoMultipolov=[];

    for(let i=0;i<5;i++){
      this.menoMultipolov.push("-----");
      this.hideMultipoly.push(true);
    }
    this.disableGet = false;


    Informacie.multipolyNaPouzitie = [];
    Informacie.redoBooelan = {redo:true};
    this.disableRedo=Informacie.redoBooelan;
    this.canvas = new fabric.Canvas('myCanvas');
    this.disableStart = false;
    this.disableStop = true;
    this.disableUndo = true;
    this.disableRedo.redo=true;
    this.pocetVrcholov = 0;
    Informacie.momentalnyStav = 0;
    Informacie.commands=[];
    Informacie.poleMultipolov = new Array();
    this.cisloVrchola = 1;
    Informacie.plocha=this.canvas;
    Informacie.vrcholyVGrafe = new Array();
    Informacie.multipolyVGrafe = new Array();
    Informacie.hranyVGrafe = new Array();
    Informacie.vrcholyVGrafe = new Array<number>();


    this.canvas.on("object:selected", function (e) {

        Informacie.selectedVrchol = e.target;
      if (e.target.type == "vertex"){
        e.target.item(0).set("fill", "#1E90FF");

      }
      if(e.target.type == "fakeVrchol"){
        e.target.set("fill", "#1E90FF");
      }
      Informacie.prvyVrchol = e.target;
    });

    this.canvas.on("selection:cleared", function () {
      if(Informacie.selectedVrchol.type == "vertex"){
        Informacie.selectedVrchol.item(0).set("fill",Informacie.selectedVrchol.aktualnaFarba);
      }
      Informacie.selectedVrchol.set("fill", Informacie.selectedVrchol.zakladnaFarba);
      Informacie.prvyVrchol = null;
      Informacie.druhyVrchol = null;

    });


    this.canvas.on("selection:updated", function (e) {
      if(Informacie.selectedVrchol.type == "vertex"){
        Informacie.selectedVrchol.item(0).set("fill",Informacie.selectedVrchol.aktualnaFarba);
      }
      Informacie.selectedVrchol.set("fill", Informacie.selectedVrchol.zakladnaFarba);

      const activeObj = e.target;
      if(activeObj.type =="vertex") {
        activeObj.item(0).set("fill", "#1E90FF");
      }
      Informacie.selectedVrchol = activeObj;

      Informacie.druhyVrchol = e.target;
      if ((Informacie.prvyVrchol.type == "vertex" || Informacie.prvyVrchol.type == "fakeVrchol") && (Informacie.druhyVrchol.type == "vertex" || Informacie.druhyVrchol.type == "fakeVrchol")) {
        const h = new HranaCommand(Informacie.prvyVrchol, Informacie.druhyVrchol, this);
        h.execute();
        while(Informacie.commands.length>Informacie.momentalnyStav){
          Informacie.commands.pop();
        }
        Informacie.redoBooelan.redo=true;
        Informacie.commands.push(h);
        Informacie.momentalnyStav = Informacie.commands.length;
      }
      Informacie.prvyVrchol = null;
      Informacie.druhyVrchol = null;
      Informacie.prvyVrchol = e.target;



    });


    this.canvas.on('mouse:over', function (e) {
      if (e.target instanceof fabric.Group) {
        if(e.target.type =="vertex" ) {
          e.target.item(1).set("fill", "black");
          this.renderAll();
        }
        if(e.target.type == "multipol"){
          e.target.item(1).set("fill", "black");
          const zhora = e.e.pageY;
          const zlava = e.e.pageX;

          Informacie.vizitka = new fabric.Text(e.target.vypis,{left: zlava -200,
            top: zhora -120,
            fill:"white",
            backgroundColor: "black",
            height: 12,
            borderColor: "black",
            fontSize: 25

          });

          Informacie.plocha.add(Informacie.vizitka);
          this.renderAll();
        }
        if(e.target.type == "multipol4" || e.target.type == "multipol3" || e.target.type == "multipol2" || e.target.type == "multipol5"){
          e.target.item(0).item(1).set("fill", "black");
          this.renderAll();
        }


      }

      if(e.target instanceof fabric.Circle  && e.target.type == "fakeVrchol"){
        const zhora = e.e.pageY;
        const zlava = e.e.pageX;
        Informacie.vizitka = new fabric.Text(e.target.name,{left: zlava -200,
          top: zhora -120,
          fill:"white",
          backgroundColor: "black",
          height: 12,
          borderColor: "black",
          fontSize: 25

        });
        Informacie.plocha.add(Informacie.vizitka);

      }
    });

    this.canvas.on('mouse:out', function (e) {
      if (e.target instanceof fabric.Group) {
        if(e.target.type=="vertex") {
          e.target.item(1).set("fill", 'transparent');
          this.renderAll();
        }
        if(e.target.type == "multipol"){
          e.target.item(1).set("fill", "transparent");
          this.renderAll();
        }
        if(e.target.type == "multipol4" || e.target.type == "multipol3" || e.target.type == "multipol2" || e.target.type == "multipol5"){
          e.target.item(0).item(1).set("fill", "transparent");
          this.renderAll();
        }
      }
      Informacie.plocha.remove(Informacie.vizitka);
    });


  }

  skusam_get(){
    const url = "https://jsonplaceholder.typicode.com/posts";

    $.get(url,function(data, status){
      console.log(data[5]["title"]);           //JSON.stringify(data)
      alert("Data: "+data[5].title+" status: "+status);
    });

  }

  vypis_multipoly(){
    for(let i=0;i<Informacie.multipolyVGrafe.length;i++){
      console.log(Informacie.multipolyVGrafe[i]);
    }
    console.log(Informacie.multipolyVGrafe);
  }

  skusam_post(){
    const url="https://jsonplaceholder.typicode.com/posts";
    let udaje = {vertices:Informacie.vrcholyVGrafe,multipoles:Informacie.multipolyVGrafe,edges:Informacie.hranyVGrafe};
    console.log(udaje);

    $.post(url, udaje,function(data, status){
      console.log("dostal som " +JSON.stringify(data));
      alert("Data: "+data+" status: "+status);
    });
  }



  calculate(){
    const url="http://localhost:8080/graph";
    let udaje = {vertices:Informacie.vrcholyVGrafe,multipoles:Informacie.multipolyVGrafe,edges:Informacie.hranyVGrafe};
    console.log(udaje);

    $.post(url, udaje,function(data, status){
      console.log("dostal som " +JSON.stringify(data));
      alert("Data: "+data+" status: "+status);
    });


  }

  vypisHrany() {
    for(let i=0;i<Informacie.hranyVGrafe.length;i++){
      console.log(Informacie.hranyVGrafe[i]);
    }
    console.log(Informacie.hranyVGrafe);

  }

  vypisVrcholy(){
    for(let i=0;i<Informacie.vrcholyVGrafe.length;i++){
      console.log(Informacie.vrcholyVGrafe[i]);
    }
    console.log(Informacie.vrcholyVGrafe);
  }

  pridajVrchol(){
    this.disableUndo=false;
    this.disableRedo.redo = true;
    const command = new VrcholCommand(this.canvas, this.cisloVrchola);
    while(Informacie.commands.length>Informacie.momentalnyStav){
      Informacie.commands.pop();
    }
    Informacie.commands.push(command);
    command.execute();
    Informacie.momentalnyStav=Informacie.commands.length;
    this.cisloVrchola++;

  }
  zmaz(){
    Informacie.plocha.clear();
    Informacie.multipolyVGrafe=[];
    Informacie.vrcholyVGrafe=[];
    Informacie.hranyVGrafe=[];

    Informacie.momentalnyStav = 0;
    this.disableUndo=true;
  }



  undoMetoda():void{
    Informacie.commands[Informacie.momentalnyStav-1].unexecute();
    Informacie.momentalnyStav--;
    this.disableRedo.redo=false;
    if(Informacie.momentalnyStav==0){
      this.disableUndo=true;
    }


  }

  redoMetoda():void{
    this.disableUndo=false;
    Informacie.plocha.forEachObject(function(obj){
      console.log(obj.toString());
      console.log("meno" + obj.name);
      if(obj.type == "multipol4"){
        const lave = obj.left;
        const horne = obj.top;

        for(let i=0;i<5;i++){
          obj.item(i).set("suradnicaLeft",lave);
          obj.item(i).set("suradnicaTop",horne);
          Informacie.plocha.add(obj.item(i));
        }
        Informacie.poleMultipolov[obj.name][0].item(0).set("fill",obj.farbaSpojenia);
        Informacie.plocha.remove(obj);
        Informacie.plocha.renderAll();
      }
      if(obj.type == "multipol5"){
        const lave = obj.left;
        const horne = obj.top;

        for(let i=0;i<6;i++){
          obj.item(i).set("suradnicaLeft",lave);
          obj.item(i).set("suradnicaTop",horne);
          Informacie.plocha.add(obj.item(i));
        }
        Informacie.poleMultipolov[obj.name][0].item(0).set("fill",obj.farbaSpojenia);
        Informacie.plocha.remove(obj);
        Informacie.plocha.renderAll();
      }

      if(obj.type == "multipol3"){
        const lave = obj.left;
        const horne = obj.top;

        for(let i=0;i<4;i++){
          obj.item(i).set("suradnicaLeft",lave);
          obj.item(i).set("suradnicaTop",horne);
          Informacie.plocha.add(obj.item(i));
        }

        Informacie.plocha.remove(obj);
        Informacie.plocha.renderAll();
      }

      if(obj.type == "multipol2"){
        const lave = obj.left;
        const horne = obj.top;

        for(let i=0;i<3;i++){
          obj.item(i).set("suradnicaLeft",lave);
          obj.item(i).set("suradnicaTop",horne);
          Informacie.plocha.add(obj.item(i));
        }

        Informacie.plocha.remove(obj);
        Informacie.plocha.renderAll();
      }
    });
    Informacie.commands[Informacie.momentalnyStav].execute();
    Informacie.momentalnyStav++;
    if(Informacie.momentalnyStav==Informacie.commands.length){
      this.disableRedo.redo=true;
    }

  }


  clear():void{   //tu este doplnit ze sa unexucutuju veci co su na ploche
    const clearCommand = new ClearCommand(this.canvas,this.pocetVrcholov);
    this.disableRedo.redo=true;
    this.disableUndo=false;
    while(Informacie.commands.length>Informacie.momentalnyStav){
      Informacie.commands.pop();
    }
    Informacie.commands.push(clearCommand);
    clearCommand.execute();
    Informacie.momentalnyStav++;


  }

  addMultipol5():void{
    this.disableUndo=false;
    this.disableRedo.redo=true;
    const multipol5 = new Multipol5Command(this.multipolmeno,"fake1","fake2","fake3","fake4","fake5","typ");
    this.multipolmeno++;
    while(Informacie.commands.length>Informacie.momentalnyStav){
      Informacie.commands.pop();
    }
    multipol5.execute();
    Informacie.commands.push(multipol5);
    Informacie.momentalnyStav=Informacie.commands.length;
  }

addMultipol4():void{
  this.disableUndo=false;
  this.disableRedo.redo=true;
    const multipol4 = new Multipol4Command(this.multipolmeno,"fake1","fake2","fake3","fake4","typ");
    this.multipolmeno++;
  while(Informacie.commands.length>Informacie.momentalnyStav){
    Informacie.commands.pop();
  }
    multipol4.execute();
  Informacie.commands.push(multipol4);
  Informacie.momentalnyStav=Informacie.commands.length;
}

  addMultipol3():void{
    this.disableUndo=false;
    this.disableRedo.redo=true;
    const multipol3 = new Multipol3Command(this.multipolmeno,"fake1","fake2","fake3","typ");
    this.multipolmeno++;
    while(Informacie.commands.length>Informacie.momentalnyStav){
      Informacie.commands.pop();
    }
    multipol3.execute();
    Informacie.commands.push(multipol3);
    Informacie.momentalnyStav=Informacie.commands.length;
  }

  addMultipol2():void{
    this.disableUndo=false;
    this.disableRedo.redo=true;
    const multipol2 = new Multipol2Command(this.multipolmeno,"fake1","fake2","typ_zo_servera");
    this.multipolmeno++;
    while(Informacie.commands.length>Informacie.momentalnyStav){
      Informacie.commands.pop();
    }
    multipol2.execute();
    Informacie.commands.push(multipol2);
    Informacie.momentalnyStav=Informacie.commands.length;

  }

  //pridavanie multipola zo servera

  add_multipol(n:number){
    let multipol;
    if(Informacie.multipolyNaPouzitie.length<n+1){
      console.log("multipoly nie su v databaze");
      return;
    }
    let hrany = Informacie.multipolyNaPouzitie[n][1];
    let typ = Informacie.multipolyNaPouzitie[n][0];

    if(hrany.length == 2){
      multipol = new Multipol2Command(this.multipolmeno,hrany[0],hrany[1],typ);
    }
    if(hrany.length == 3){
      multipol = new Multipol3Command(this.multipolmeno,hrany[0],hrany[1],hrany[2],typ);

    }
    if(hrany.length == 4){
      multipol = new Multipol4Command(this.multipolmeno,hrany[0],hrany[1],hrany[2],hrany[3],typ);

    }
    if(hrany.length == 5){
      multipol = new Multipol5Command(this.multipolmeno,hrany[0],hrany[1],hrany[2],hrany[3],hrany[4],typ);

    }

    this.disableUndo=false;
    this.disableRedo.redo=true;
    this.multipolmeno++;
    while(Informacie.commands.length>Informacie.momentalnyStav){
      Informacie.commands.pop();
    }
    multipol.execute();
    Informacie.commands.push(multipol);
    Informacie.momentalnyStav=Informacie.commands.length;

  }


  get_multipols(){

    const url = "http://localhost:8080/multipols";
    $.get(url,function(data, status){

      for(let i=0;i<data.length;i++){
        let pole = [];
        pole.push(data[i].name);
        pole.push(data[i].dangling_edges);
        Informacie.multipolyNaPouzitie.push(pole);
      }

    });
    for(let i=0;i<Informacie.multipolyNaPouzitie.length;i++){
      this.menoMultipolov[i]=Informacie.multipolyNaPouzitie[i][0];
      this.hideMultipoly[i]=false;
    }
    this.disableGet=true;


  }
//tu len skusam to co dostanem od servera ci to viem spracovat
  get_multipols_fake(){

    let pole = [];
    let poleMult = ["i1", "i2", "o1", "o2", "r"];
    pole.push("negator_Pg");
    pole.push(poleMult);
    Informacie.multipolyNaPouzitie.push(pole);
    pole = [];
    poleMult = ["i1", "i2", "o1", "o2"];
    pole.push("isochromatic_Pg");
    pole.push(poleMult);
    Informacie.multipolyNaPouzitie.push(pole);
    pole = [];
    poleMult = ["i1", "i2", "o1", "o2", "o3"];
    pole.push("(2,3)-pole_Pg");
    pole.push(poleMult);
    Informacie.multipolyNaPouzitie.push(pole);

    for(let i=0;i<Informacie.multipolyNaPouzitie.length;i++){
      this.menoMultipolov[i]=Informacie.multipolyNaPouzitie[i][0];
      this.hideMultipoly[i]=false;
    }
    this.disableGet=true;


  }





}
