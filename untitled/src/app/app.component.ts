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

//mozem spojit 2 semiedges jedneho multipola? zatial ano, este neviem ci to mozem ci nie, tak to zatial necham tak

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


  ngOnInit(): void {
    $(document).ready(function(){
      $("h1").click(function(){
        $(this).hide();
      });
    });
    $("#vypocitaj").click(function(){
      $.post("https://jsonplaceholder.typicode.com/posts", {"uno":Informacie.hranyVGrafe[0],
        "duo":Informacie.hranyVGrafe[1]},function(data, status){
        console.log("poslal som:");
        for(let i=0;i<Informacie.hranyVGrafe.length;i++){
          console.log(JSON.stringify(Informacie.hranyVGrafe[i]));
        }
        console.log("dostal som " +JSON.stringify(data));           //JSON.stringify(data)
        alert("Data: "+data+" status: "+status);
      });
    });


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
          fill:"black",
          backgroundColor: "dodgerblue",
          height: 15,
          borderColor: "black",
          fontSize: 30

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
  }

  add_multipol1(){
    const url = "";

    $.get(url,function(data, status){
      let multipol;

      if(data.dangling_edges.length==2){
          multipol = new Multipol2Command(this.multipolmeno,data.dangling_edges[0],data.dangling_edges[1]);
      }
      if(data.dangling_edges.length==3){
         multipol = new Multipol3Command(this.multipolmeno,data.dangling_edges[0],data.dangling_edges[1],data.dangling_edges[2]);
      }
      if(data.dangling_edges.length==4){
         multipol = new Multipol4Command(this.multipolmeno,data.dangling_edges[0],data.dangling_edges[1],data.dangling_edges[2],data.dangling_edges[3]);
      }
      if(data.dangling_edges.length==5){
         multipol = new Multipol5Command(this.multipolmeno,data.dangling_edges[0],data.dangling_edges[1],data.dangling_edges[2],data.dangling_edges[3],data.dangling_edges[4]);
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

    });

  }




  calculate(){
    const url="http://localhost:8080/graph";
    let udaje = [];
    udaje.push(Informacie.vrcholyVGrafe,Informacie.multipolyVGrafe,Informacie.hranyVGrafe);
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

  }

  vypisVrcholy(){
    for(let i=0;i<Informacie.vrcholyVGrafe.length;i++){
      console.log(Informacie.vrcholyVGrafe[i]);
    }
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
    const multipol5 = new Multipol5Command(this.multipolmeno,"fake1","fake2","fake3","fake4","fake5");
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
    const multipol4 = new Multipol4Command(this.multipolmeno,"fake1","fake2","fake3","fake4");
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
    const multipol3 = new Multipol3Command(this.multipolmeno,"fake1","fake2","fake3");
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
    const multipol2 = new Multipol2Command(this.multipolmeno,"fake1","fake2");
    this.multipolmeno++;
    while(Informacie.commands.length>Informacie.momentalnyStav){
      Informacie.commands.pop();
    }
    multipol2.execute();
    Informacie.commands.push(multipol2);
    Informacie.momentalnyStav=Informacie.commands.length;

  }





}
